"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preset = exports.presetName = void 0;
const tslib_1 = require("tslib");
const path = require("path");
const addPlugin = require("@graphql-codegen/add");
const typeScriptPlugin = require("@graphql-codegen/typescript");
const typeScriptResolversPlugin = require("@graphql-codegen/typescript-resolvers");
const plugin_helpers_1 = require("@graphql-codegen/plugin-helpers");
const ts_morph_1 = require("ts-morph");
const parseSources_1 = require("./parseSources");
const parseGraphQLSchema_1 = require("./parseGraphQLSchema");
const generateResolverFiles_1 = require("./generateResolverFiles");
const generateTypeDefsFiles_1 = require("./generateTypeDefsFiles");
const getGraphQLObjectTypeResolversToGenerate_1 = require("./getGraphQLObjectTypeResolversToGenerate");
const addVirtualTypesFileToTsMorphProject_1 = require("./addVirtualTypesFileToTsMorphProject");
const parseTypeMappers_1 = require("./parseTypeMappers");
const validatePresetConfig_1 = require("./validatePresetConfig");
const validateAndMergeParsedConfigs_1 = require("./validateAndMergeParsedConfigs");
exports.presetName = '@eddeee888/gcg-typescript-resolver-files';
exports.preset = {
    buildGeneratesSection: ({ schema, schemaAst, presetConfig: rawPresetConfig, baseOutputDir, profiler = (0, plugin_helpers_1.createNoopProfiler)(), }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (!schemaAst) {
            throw new Error('Missing schemaAst');
        }
        const sources = schemaAst.extensions.extendedSources;
        if (!Array.isArray(sources) || sources.length === 0) {
            throw new Error('Empty Sources. Make sure schema files are parsed correctly.');
        }
        const { resolverTypesPath: relativeResolverTypesPathFromBaseOutputDir, resolverRelativeTargetDir, mappersFileExtension: typeMappersFileExtension, mappersSuffix: typeMappersSuffix, resolverMainFile, resolverMainFileMode, typeDefsFilePath, typeDefsFileMode, scalarsModule, scalarsOverrides, mode, whitelistedModules, blacklistedModules, externalResolvers, typesPluginsConfig, tsMorphProjectOptions, fixObjectTypeResolvers, emitLegacyCommonJSImports, } = (0, validatePresetConfig_1.validatePresetConfig)(rawPresetConfig);
        const resolverTypesPath = path.posix.join(baseOutputDir, relativeResolverTypesPathFromBaseOutputDir);
        const { sourceMap } = (0, parseSources_1.parseSources)(sources);
        const tsMorphProject = yield profiler.run(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return new ts_morph_1.Project(tsMorphProjectOptions); }), createProfilerRunName('Initialising ts-morph project'));
        const typeMappersMap = yield profiler.run(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return (0, parseTypeMappers_1.parseTypeMappers)({
                sourceMap,
                resolverTypesPath,
                typeMappersFileExtension,
                typeMappersSuffix,
                tsMorphProject,
                shouldCollectPropertyMap: fixObjectTypeResolvers !== 'disabled',
                emitLegacyCommonJSImports,
            });
        }), createProfilerRunName('parseTypeMappers'));
        const generatesSection = [];
        const parsedGraphQLSchemaMeta = yield (0, parseGraphQLSchema_1.parseGraphQLSchema)({
            schemaAst,
            sourceMap,
            scalarsModule,
            scalarsOverrides,
            typeMappersMap,
            whitelistedModules,
            blacklistedModules,
        });
        const mergedConfig = (0, validateAndMergeParsedConfigs_1.validateAndMergeParsedConfigs)({
            externalResolvers,
            parsedGraphQLSchemaMeta,
        });
        // typescript and typescript-resolvers plugins config
        const resolverTypesConfig = Object.assign(Object.assign({ enumsAsTypes: true, emitLegacyCommonJSImports, optionalResolveType: true, resolversNonOptionalTypename: {
                unionMember: true,
                interfaceImplementingType: true,
            } }, typesPluginsConfig), { scalars: Object.assign({}, mergedConfig.scalarTypes), mappers: Object.assign(Object.assign({}, mergedConfig.typeMappers), typesPluginsConfig.mappers) });
        // typesSourceFile is the virtual `types.generated.ts`
        // This is useful when we need to do static analysis as most types come from this file
        // e.g. comparing mappers field type vs schema object field type
        const typesSourceFile = yield profiler.run(() => (0, addVirtualTypesFileToTsMorphProject_1.addVirtualTypesFileToTsMorphProject)({
            tsMorphProject,
            schemaAst,
            resolverTypesConfig,
            resolverTypesPath,
        }), createProfilerRunName('addVirtualTypesFileToTsMorphProject'));
        const graphQLObjectTypeResolversToGenerate = yield profiler.run(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return (0, getGraphQLObjectTypeResolversToGenerate_1.getGraphQLObjectTypeResolversToGenerate)({
                typesSourceFile,
                userDefinedSchemaObjectTypeMap: mergedConfig.userDefinedSchemaTypeMap.object,
                typeMappersMap,
            });
        }), createProfilerRunName('graphQLObjectTypeResolversToGenerate'));
        const resolverTypesFile = {
            filename: resolverTypesPath,
            pluginMap: {
                typescript: typeScriptPlugin,
                'typescript-resolvers': typeScriptResolversPlugin,
            },
            plugins: [{ typescript: {} }, { ['typescript-resolvers']: {} }],
            config: resolverTypesConfig,
            schema,
            documents: [],
        };
        generatesSection.push(resolverTypesFile);
        // typeDefs
        if (typeDefsFilePath) {
            const typeDefsFiles = yield profiler.run(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return (0, generateTypeDefsFiles_1.generateTypeDefsFiles)({
                    baseOutputDir,
                    typeDefsFilePath,
                    typeDefsFileMode,
                    sourceMap,
                    whitelistedModules,
                    blacklistedModules,
                });
            }), createProfilerRunName('generateTypeDefsFiles'));
            Object.entries(typeDefsFiles).forEach(([filename, meta]) => {
                const typeDefsFile = {
                    filename: filename,
                    pluginMap: { add: addPlugin },
                    plugins: [{ add: { content: meta.content } }],
                    config: {},
                    schema,
                    documents: [],
                };
                generatesSection.push(typeDefsFile);
            });
        }
        // resolver files
        const result = {
            files: {},
            externalImports: {},
        };
        yield profiler.run(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return (0, generateResolverFiles_1.generateResolverFiles)({
                config: {
                    schema: schemaAst,
                    sourceMap,
                    baseOutputDir,
                    resolverTypesPath,
                    resolverRelativeTargetDir,
                    resolverMainFile,
                    resolverMainFileMode,
                    graphQLObjectTypeResolversToGenerate,
                    tsMorph: {
                        project: tsMorphProject,
                        typesSourceFile,
                    },
                    fixObjectTypeResolvers,
                    mode,
                    whitelistedModules,
                    blacklistedModules,
                    externalResolvers: Object.assign({}, mergedConfig.externalResolvers),
                    emitLegacyCommonJSImports,
                },
                result,
            });
        }), createProfilerRunName('generateResolverFiles'));
        const resolverFilesGenerateOptions = Object.entries(result.files).map(([filename, { content }]) => ({
            filename,
            pluginMap: { add: addPlugin },
            plugins: [{ add: { content } }],
            config: {},
            schema,
            documents: [],
        }));
        return [...resolverFilesGenerateOptions, ...generatesSection];
    }),
};
const createProfilerRunName = (traceName) => `[${exports.presetName}]: ${traceName}`;
//# sourceMappingURL=preset.js.map