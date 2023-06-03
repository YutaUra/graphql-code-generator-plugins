"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addResolverMainFiles = void 0;
const path = require("path");
const utils_1 = require("../utils");
const createDefaultFileDetails = () => ({
    importLines: [],
    queryFields: [],
    mutationFields: [],
    subscriptionFields: [],
    objectTypes: [],
});
const addResolverMainFiles = ({ config: { baseOutputDir, resolverTypesPath, resolverMainFile, resolverMainFileMode, emitLegacyCommonJSImports, }, result, }) => {
    const resolverMainFiles = Object.entries(result.files).reduce((res, [filepath, file]) => {
        if (file.__filetype === 'file') {
            return res;
        }
        const { meta } = file;
        // If resolverMainFileMode === 'modules', generate main resolver files into modules, otherwise, do it at baseOutputDir
        const resolverMainFilename = resolverMainFileMode === 'modules'
            ? path.posix.join(baseOutputDir, meta.moduleName, resolverMainFile)
            : path.posix.join(baseOutputDir, resolverMainFile);
        const outputDir = path.dirname(resolverMainFilename);
        if (!res[resolverMainFilename]) {
            res[resolverMainFilename] = createDefaultFileDetails();
        }
        // Non Root Object fields that was generated
        if (file.__filetype === 'objectType' ||
            file.__filetype === 'generalResolver') {
            res[resolverMainFilename].importLines.push((0, utils_1.printImportLine)({
                isTypeImport: false,
                module: (0, utils_1.relativeModulePath)(outputDir, filepath),
                moduleType: 'file',
                namedImports: [file.mainImportIdentifier],
                emitLegacyCommonJSImports,
            }));
            res[resolverMainFilename].objectTypes.push({
                propertyName: file.mainImportIdentifier,
                identifierName: file.mainImportIdentifier,
            });
            return res;
        }
        // Root object fields
        const identifierName = file.meta.normalizedResolverName
            .split('.')
            .join('_');
        const fieldMapping = {
            propertyName: file.mainImportIdentifier,
            identifierName,
        };
        res[resolverMainFilename].importLines.push((0, utils_1.printImportLine)({
            isTypeImport: false,
            module: (0, utils_1.relativeModulePath)(outputDir, filepath),
            moduleType: 'file',
            namedImports: [fieldMapping],
            emitLegacyCommonJSImports,
        }));
        const rootObjectMap = {
            Query: () => res[resolverMainFilename].queryFields.push(fieldMapping),
            Mutation: () => res[resolverMainFilename].mutationFields.push(fieldMapping),
            Subscription: () => res[resolverMainFilename].subscriptionFields.push(fieldMapping),
        };
        rootObjectMap[file.meta.belongsToRootObject]();
        return res;
    }, {});
    Object.entries(result.externalImports).reduce((res, [module, meta]) => {
        // If resolverMainFileMode === 'modules', generate main resolver files into modules, otherwise, do it at baseOutputDir
        const resolverMainFilename = resolverMainFileMode === 'modules'
            ? path.posix.join(baseOutputDir, meta.moduleName, resolverMainFile)
            : path.posix.join(baseOutputDir, resolverMainFile);
        if (!res[resolverMainFilename]) {
            res[resolverMainFilename] = createDefaultFileDetails();
        }
        res[resolverMainFilename].importLines.push((0, utils_1.printImportLine)({
            isTypeImport: false,
            module,
            moduleType: 'preserve',
            namedImports: meta.importLineMeta.namedImports,
            defaultImport: meta.importLineMeta.defaultImport,
            emitLegacyCommonJSImports,
        }));
        meta.identifierUsages.forEach((usage) => {
            const resolverNameParts = usage.normalizedResolverName.split('.');
            // Only 1 part, this is a GraphQL ObjectType
            if (resolverNameParts.length === 1) {
                res[resolverMainFilename].objectTypes.push({
                    propertyName: resolverNameParts[0],
                    identifierName: usage.identifierName,
                });
                return;
            }
            // 2+ parts, treat as 2 parts. This is a GraphQL ObjectType with field e.g. Query.me, Mutation.updateUser
            const [rootObjectType, field] = resolverNameParts;
            if (!(0, utils_1.isRootObjectType)(rootObjectType)) {
                throw new Error(`Unexpected root object type found: ${rootObjectType}`);
            }
            const fieldMapping = {
                identifierName: usage.identifierName,
                propertyName: field,
            };
            const rootObjectMap = {
                Query: () => res[resolverMainFilename].queryFields.push(fieldMapping),
                Mutation: () => res[resolverMainFilename].mutationFields.push(fieldMapping),
                Subscription: () => res[resolverMainFilename].subscriptionFields.push(fieldMapping),
            };
            rootObjectMap[rootObjectType]();
        });
        return res;
    }, resolverMainFiles);
    const resolversIdentifier = 'resolvers';
    const resolversTypeName = 'Resolvers'; // Generated type from typescript-resolvers plugin
    Object.entries(resolverMainFiles).forEach(([resolverMainFilename, resolverMainFile]) => {
        const outputDir = path.dirname(resolverMainFilename);
        const relativePathToResolverTypes = (0, utils_1.relativeModulePath)(outputDir, resolverTypesPath);
        const queries = resolverMainFile.queryFields.length > 0
            ? `Query: { ${resolverMainFile.queryFields
                .map(printObjectMapping)
                .join(',')} },`
            : '';
        const mutations = resolverMainFile.mutationFields.length > 0
            ? `Mutation: { ${resolverMainFile.mutationFields
                .map(printObjectMapping)
                .join(',')} },`
            : '';
        const suscriptions = resolverMainFile.subscriptionFields.length > 0
            ? `Subscription: { ${resolverMainFile.subscriptionFields
                .map(printObjectMapping)
                .join(',')} },`
            : '';
        result.files[resolverMainFilename] = {
            __filetype: 'file',
            content: `/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    ${(0, utils_1.printImportLine)({
                isTypeImport: true,
                module: relativePathToResolverTypes,
                moduleType: 'file',
                namedImports: [resolversTypeName],
                emitLegacyCommonJSImports,
            })}
    ${resolverMainFile.importLines.map((line) => line).join('\n')}
    export const ${resolversIdentifier}: ${resolversTypeName} = {
      ${queries}
      ${mutations}
      ${suscriptions}
      ${resolverMainFile.objectTypes.map(printObjectMapping).join(',\n')}
    }`,
            mainImportIdentifier: resolversIdentifier,
        };
    });
};
exports.addResolverMainFiles = addResolverMainFiles;
const printObjectMapping = ({ propertyName, identifierName, }) => `${propertyName}: ${identifierName}`;
//# sourceMappingURL=addResolverMainFiles.js.map