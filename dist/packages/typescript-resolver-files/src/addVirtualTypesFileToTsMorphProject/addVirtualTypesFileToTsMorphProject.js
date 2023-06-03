"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVirtualTypesFileToTsMorphProject = void 0;
const tslib_1 = require("tslib");
const typeScriptPlugin = require("@graphql-codegen/typescript");
const typeScriptResolversPlugin = require("@graphql-codegen/typescript-resolvers");
const addVirtualTypesFileToTsMorphProject = ({ tsMorphProject, schemaAst, resolverTypesPath, resolverTypesConfig, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const typesFile = yield generateVirtualTypesFile({
        schemaAst,
        resolverTypesPath,
        resolverTypesConfig,
    });
    const typesSourceFile = tsMorphProject.createSourceFile(typesFile.filePath, typesFile.content, { overwrite: true });
    return typesSourceFile;
});
exports.addVirtualTypesFileToTsMorphProject = addVirtualTypesFileToTsMorphProject;
/**
 * getVirtualTypesFile generates a virtual types.generated.ts file
 * This is used to statically detect and compare types in the parse and post-process steps
 */
const generateVirtualTypesFile = ({ schemaAst, resolverTypesPath, resolverTypesConfig, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const [typescriptResult, typescriptResolversResult] = yield Promise.all([
        typeScriptPlugin.plugin(schemaAst, [], resolverTypesConfig),
        typeScriptResolversPlugin.plugin(schemaAst, [], resolverTypesConfig),
    ]);
    return {
        filePath: resolverTypesPath,
        content: `
    ${(_a = typescriptResult.prepend) === null || _a === void 0 ? void 0 : _a.join('\n')}
    ${(_b = typescriptResolversResult.prepend) === null || _b === void 0 ? void 0 : _b.join('\n')}
    ${typescriptResult.content}${typescriptResolversResult.content}`,
    };
});
//# sourceMappingURL=addVirtualTypesFileToTsMorphProject.js.map