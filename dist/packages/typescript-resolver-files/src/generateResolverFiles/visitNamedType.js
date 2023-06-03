"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitNamedType = void 0;
const path = require("path");
const graphql_1 = require("graphql");
const utils_1 = require("../utils");
const addExternalResolverImport_1 = require("./addExternalResolverImport");
const visitNamedType = ({ namedType, resolverName, belongsToRootObject, location, visitor, }, ctx) => {
    const normalizedResolverName = normalizeResolverName(resolverName, belongsToRootObject);
    // Check to see if need to generate resolver files
    const parsedDetails = parseLocationForOutputDir(belongsToRootObject ? [belongsToRootObject] : [], ctx, location);
    if (!parsedDetails) {
        // No `parsedDetails` means the location is NOT whitelisted, ignore.
        return;
    }
    const { moduleName, outputDir } = parsedDetails;
    const externalResolverImportSyntax = ctx.config.externalResolvers[normalizedResolverName];
    if (externalResolverImportSyntax) {
        // If has external resolver, use it
        (0, addExternalResolverImport_1.addExternalResolverImport)({
            moduleName,
            normalizedResolverName,
            configImportSyntax: externalResolverImportSyntax,
        }, ctx);
        return;
    }
    // Generate resolver files based on its type
    const visitorHandlerParams = validateAndPrepareForGraphQLTypeHandler({
        resolverName,
        normalizedResolverName,
        outputDir,
        belongsToRootObject,
        moduleName,
    }, ctx);
    if (visitorHandlerParams.belongsToRootObject) {
        visitor['RootObjectTypeField'](visitorHandlerParams, ctx);
    }
    else {
        if ((0, graphql_1.isObjectType)(namedType)) {
            visitor['ObjectType'](visitorHandlerParams, ctx);
        }
        else if ((0, graphql_1.isUnionType)(namedType)) {
            visitor['UnionType'](visitorHandlerParams, ctx);
        }
        else if ((0, graphql_1.isScalarType)(namedType)) {
            visitor['ScalarType'](visitorHandlerParams, ctx);
        }
        else if ((0, graphql_1.isInterfaceType)(namedType)) {
            visitor['InterfaceType'](visitorHandlerParams, ctx);
        }
    }
};
exports.visitNamedType = visitNamedType;
/**
 * Parse location to see which module it belongs to.
 * Also check against whitelisted and blacklisted to see if need to generate file.
 */
const parseLocationForOutputDir = (nestedDirs, { config: { mode, sourceMap, whitelistedModules, blacklistedModules, baseOutputDir, resolverRelativeTargetDir, }, }, location) => {
    // If mode is "merged", there's only one module:
    //   - always generate a.k.a  it's always whitelisted
    //   - put them together at designated relativeTargetDir
    //   - moduleName='' i.e. no module
    if (mode === 'merged') {
        return {
            outputDir: path.posix.join(baseOutputDir, resolverRelativeTargetDir, ...nestedDirs),
            moduleName: '',
        };
    }
    // 2. mode is "modules", each module is the folder containing the schema files
    // This means one or multiple schema files can add up to one module
    const parsedSource = (0, utils_1.parseLocationForWhitelistedModule)({
        location,
        sourceMap,
        whitelistedModules,
        blacklistedModules,
    });
    return parsedSource
        ? {
            outputDir: path.posix.join(baseOutputDir, parsedSource.moduleName, resolverRelativeTargetDir, ...nestedDirs),
            moduleName: parsedSource.moduleName,
        }
        : undefined;
};
const validateAndPrepareForGraphQLTypeHandler = ({ resolverName, normalizedResolverName, outputDir, belongsToRootObject, moduleName, }, { config, result }) => {
    const fieldFilePath = path.posix.join(outputDir, `${resolverName}.ts`);
    if (result.files[fieldFilePath]) {
        throw new Error(`Unexpected duplication in field filename. Type: ${resolverName}, file: ${fieldFilePath}`);
    }
    // resolverTypeName are generated from typescript-resolvers plugin
    const resolversTypeMetaModule = (0, utils_1.relativeModulePath)(outputDir, config.resolverTypesPath);
    const resolversTypeMeta = belongsToRootObject
        ? {
            typeNamedImport: `${belongsToRootObject}Resolvers`,
            module: resolversTypeMetaModule,
            moduleType: 'file',
            typeString: `${belongsToRootObject}Resolvers['${resolverName}']`,
        }
        : {
            typeNamedImport: `${resolverName}Resolvers`,
            module: resolversTypeMetaModule,
            moduleType: 'file',
            typeString: `${resolverName}Resolvers`,
        };
    return {
        fieldFilePath,
        resolverName,
        belongsToRootObject,
        normalizedResolverName,
        resolversTypeMeta,
        moduleName,
    };
};
/**
 * Function to get format resolver name based on its definition in the schema
 * - Root object type resolver e.g Query.me, Mutation.updateUser
 * - Object type e.g. User, Profile
 */
const normalizeResolverName = (name, rootObject) => {
    if (!rootObject) {
        return name;
    }
    return `${rootObject}.${name}`;
};
//# sourceMappingURL=visitNamedType.js.map