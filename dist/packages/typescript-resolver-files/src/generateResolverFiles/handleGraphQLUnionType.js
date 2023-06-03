"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGraphQLUnionType = void 0;
const utils_1 = require("../utils");
const handleGraphQLUnionType = ({ fieldFilePath, resolverName, normalizedResolverName, resolversTypeMeta, moduleName, }, { result, config: { emitLegacyCommonJSImports } }) => {
    const variableStatement = `export const ${resolverName}: ${resolversTypeMeta.typeString} = { /* Implement ${resolverName} union logic here */ };`;
    result.files[fieldFilePath] = {
        __filetype: 'generalResolver',
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
        },
    };
};
exports.handleGraphQLUnionType = handleGraphQLUnionType;
//# sourceMappingURL=handleGraphQLUnionType.js.map