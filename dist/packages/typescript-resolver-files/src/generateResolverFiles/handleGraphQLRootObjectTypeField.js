"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGraphQLRootObjectTypeField = void 0;
const utils_1 = require("../utils");
const handleGraphQLRootObjectTypeField = ({ fieldFilePath, resolverName, belongsToRootObject, normalizedResolverName, resolversTypeMeta, moduleName, }, { result, config: { emitLegacyCommonJSImports } }) => {
    const suggestion = `/* Implement ${normalizedResolverName} resolver logic here */`;
    let variableStatement = `export const ${resolverName}: NonNullable<${resolversTypeMeta.typeString}> = async (_parent, _arg, _ctx) => { ${suggestion} };`;
    if (belongsToRootObject === 'Subscription') {
        variableStatement = `export const ${resolverName}: NonNullable<${resolversTypeMeta.typeString}> = {
      subscribe: async (_parent, _arg, _ctx) => { ${suggestion} },
    }`;
    }
    result.files[fieldFilePath] = {
        __filetype: 'rootObjectTypeFieldResolver',
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
            belongsToRootObject,
            variableStatement,
            normalizedResolverName,
        },
    };
};
exports.handleGraphQLRootObjectTypeField = handleGraphQLRootObjectTypeField;
//# sourceMappingURL=handleGraphQLRootObjectTypeField.js.map