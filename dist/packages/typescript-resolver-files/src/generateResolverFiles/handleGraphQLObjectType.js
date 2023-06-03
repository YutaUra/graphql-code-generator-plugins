"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGraphQLObjectType = void 0;
const utils_1 = require("../utils");
const handleGraphQLObjectType = ({ fieldFilePath, resolverName, normalizedResolverName, resolversTypeMeta, moduleName, }, { result, config: { graphQLObjectTypeResolversToGenerate, emitLegacyCommonJSImports }, }) => {
    const variableStatement = `export const ${resolverName}: ${resolversTypeMeta.typeString} = { 
    /* Implement ${resolverName} resolver logic here */ 
  };`;
    result.files[fieldFilePath] = {
        __filetype: 'objectType',
        content: `
    ${(0, utils_1.printImportLine)({
            isTypeImport: true,
            module: resolversTypeMeta.module,
            moduleType: resolversTypeMeta.moduleType,
            namedImports: [resolversTypeMeta.typeNamedImport],
            emitLegacyCommonJSImports,
        })}
    ${variableStatement}`,
        mainImportIdentifier: resolverName,
        meta: {
            moduleName,
            normalizedResolverName,
            variableStatement,
            resolversToGenerate: graphQLObjectTypeResolversToGenerate[resolverName], // Array of all resolvers that may need type checking
        },
    };
};
exports.handleGraphQLObjectType = handleGraphQLObjectType;
//# sourceMappingURL=handleGraphQLObjectType.js.map