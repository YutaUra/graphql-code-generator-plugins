"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGraphQLScalarType = void 0;
const utils_1 = require("../utils");
const graphQLScalarType = 'GraphQLScalarType';
const handleGraphQLScalarType = ({ fieldFilePath, resolverName, normalizedResolverName, moduleName }, { result, config: { emitLegacyCommonJSImports } }) => {
    const variableStatement = `export const ${resolverName}: ${graphQLScalarType} = { /* Implement ${resolverName} scalar logic here */ };`;
    result.files[fieldFilePath] = {
        __filetype: 'generalResolver',
        content: `
    ${(0, utils_1.printImportLine)({
            isTypeImport: true,
            module: 'graphql',
            moduleType: 'module',
            namedImports: [graphQLScalarType],
            emitLegacyCommonJSImports,
        })}
    ${variableStatement}`,
        mainImportIdentifier: resolverName,
        meta: {
            moduleName,
            normalizedResolverName,
            variableStatement,
        },
    };
};
exports.handleGraphQLScalarType = handleGraphQLScalarType;
//# sourceMappingURL=handleGraphQLScalarType.js.map