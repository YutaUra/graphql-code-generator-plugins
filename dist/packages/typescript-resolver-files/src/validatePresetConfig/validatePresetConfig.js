"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePresetConfig = void 0;
const tslib_1 = require("tslib");
const path = require("path");
const fs = require("fs");
const utils_1 = require("../utils");
const defaultResolverRelativeTargetDirMap = {
    modules: 'resolvers',
    merged: '',
};
const defaultTypeDefsFilePath = './typeDefs.generated.ts';
const defaultScalarsModule = 'graphql-scalars';
const validatePresetConfig = ({ resolverTypesPath = './types.generated.ts', resolverRelativeTargetDir, resolverMainFile = 'resolvers.generated.ts', resolverMainFileMode = 'merged', typeDefsFilePath = defaultTypeDefsFilePath, typeDefsFileMode: inputTypeDefsFileMode = 'merged', mappersFileExtension = '.mappers.ts', mappersSuffix = 'Mapper', scalarsModule = 'graphql-scalars', scalarsOverrides = {}, mode = 'modules', whitelistedModules, blacklistedModules, externalResolvers = {}, typesPluginsConfig = {}, tsConfigFilePath = './tsconfig.json', fixObjectTypeResolvers = 'smart', emitLegacyCommonJSImports = true, }) => {
    if (mode !== 'merged' && mode !== 'modules') {
        throw new Error(utils_1.fmt.error('presetConfig.mode must be "merged" or "modules" (default is "modules")', 'Validation'));
    }
    if (fixObjectTypeResolvers !== 'smart' &&
        fixObjectTypeResolvers !== 'disabled') {
        throw new Error(utils_1.fmt.error('presetConfig.fixObjectTypeResolvers must be "smart" or "disabled" (default is "smart")', 'Validation'));
    }
    if (resolverMainFileMode !== 'merged' && resolverMainFileMode !== 'modules') {
        throw new Error(utils_1.fmt.error('presetConfig.resolverMainFileMode must be "merged" or "modules" (default is "merged")', 'Validation'));
    }
    let typeDefsFileMode = inputTypeDefsFileMode;
    if (mode === 'merged') {
        // If mode is `merged`, `typeDefsFileMode` is also `merged` because there's no whitelisted or modules concepts
        typeDefsFileMode = 'merged';
        console.warn(utils_1.fmt.warn(`presetConfig.typeDefsFileMode has automatically been set to "merged" because presetConfig.mode is "merged"`));
    }
    if (typeDefsFileMode !== 'merged' &&
        typeDefsFileMode !== 'modules' &&
        typeDefsFileMode !== 'mergedWhitelisted') {
        throw new Error(utils_1.fmt.error('presetConfig.typeDefsFileMode must be "merged", "mergedWhitelisted" or "modules" (default is "merged")', 'Validation'));
    }
    if (!resolverTypesPath) {
        throw new Error(utils_1.fmt.error('presetConfig.resolverTypesPath is required', 'Validation'));
    }
    const finalResolverRelativeTargetDir = resolverRelativeTargetDir === undefined
        ? defaultResolverRelativeTargetDirMap[mode]
        : resolverRelativeTargetDir;
    if (path.extname(resolverMainFile) === '') {
        throw new Error(utils_1.fmt.error('presetConfig.mainFile must be a valid file name', 'Validation'));
    }
    if (whitelistedModules) {
        if (!Array.isArray(whitelistedModules)) {
            throw new Error(utils_1.fmt.error('presetConfig.whitelistedModules must be an array if provided', 'Validation'));
        }
        if (mode !== 'modules') {
            throw new Error(utils_1.fmt.error('presetConfig.whitelistedModules can only be used with presetConfig.mode == "modules"', 'Validation'));
        }
    }
    if (blacklistedModules) {
        if (!Array.isArray(blacklistedModules)) {
            throw new Error(utils_1.fmt.error('presetConfig.blacklistedModules must be an array if provided', 'Validation'));
        }
        if (mode !== 'modules') {
            throw new Error(utils_1.fmt.error('presetConfig.blacklistedModules can only be used with presetConfig.mode == "modules"', 'Validation'));
        }
    }
    const validatedTypesPluginsConfig = validateTypesPluginsConfig(typesPluginsConfig);
    let finalTypeDefsFilePath = typeDefsFilePath;
    if (finalTypeDefsFilePath === true) {
        finalTypeDefsFilePath = defaultTypeDefsFilePath;
    }
    let finalScalarsModule = scalarsModule;
    if (finalScalarsModule === true) {
        finalScalarsModule = defaultScalarsModule;
    }
    const tsMorphProjectOptions = {
        skipAddingFilesFromTsConfig: true, // avoid long startup time by NOT loading files included by tsconfig.json. We only use this virtually anyways so we don't need all the files
    };
    if (tsConfigFilePath) {
        const absoluteTsConfigFilePath = path.join((0, utils_1.cwd)(), tsConfigFilePath);
        if (fs.existsSync(absoluteTsConfigFilePath)) {
            tsMorphProjectOptions.tsConfigFilePath = absoluteTsConfigFilePath;
        }
        else {
            console.warn(utils_1.fmt.warn(`Unable to find TypeScript config at ${absoluteTsConfigFilePath}. Use presetConfig.tsConfigFilePath to set a custom value. Otherwise, type analysis may not work correctly.`));
        }
    }
    return {
        resolverTypesPath,
        resolverRelativeTargetDir: finalResolverRelativeTargetDir,
        resolverMainFile,
        resolverMainFileMode,
        typeDefsFilePath: finalTypeDefsFilePath,
        typeDefsFileMode,
        mode,
        mappersFileExtension,
        mappersSuffix,
        scalarsModule: finalScalarsModule,
        scalarsOverrides,
        whitelistedModules: whitelistedModules || [],
        blacklistedModules: blacklistedModules || [],
        externalResolvers,
        typesPluginsConfig: validatedTypesPluginsConfig,
        tsMorphProjectOptions,
        fixObjectTypeResolvers,
        emitLegacyCommonJSImports,
    };
};
exports.validatePresetConfig = validatePresetConfig;
const validateTypesPluginsConfig = (config) => {
    if ('scalars' in config) {
        throw new Error(utils_1.fmt.error('presetConfig.typesPluginsConfig.scalars is not supported. Use presetConfig.scalarsOverrides instead.', 'Validation'));
    }
    if ('emitLegacyCommonJSImports' in config) {
        throw new Error(utils_1.fmt.error('presetConfig.typesPluginsConfig.emitLegacyCommonJSImports is not supported. Use presetConfig.emitLegacyCommonJSImports instead.', 'Validation'));
    }
    const { scalars: _, emitLegacyCommonJSImports: __ } = config, rest = tslib_1.__rest(config, ["scalars", "emitLegacyCommonJSImports"]);
    return rest;
};
//# sourceMappingURL=validatePresetConfig.js.map