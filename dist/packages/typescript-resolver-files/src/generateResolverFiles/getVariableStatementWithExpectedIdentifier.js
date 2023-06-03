"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariableStatementWithExpectedIdentifier = void 0;
const getVariableStatementWithExpectedIdentifier = (sourceFile, resolverFile) => {
    let isExported = false;
    const variableStatementWithExpectedIdentifier = sourceFile.getVariableStatement((statement) => {
        let hasExpectedIdentifier = false;
        statement
            .getDeclarationList()
            .getDeclarations()
            .forEach((declarationNode) => {
            if (declarationNode.getName() === resolverFile.mainImportIdentifier) {
                hasExpectedIdentifier = true;
                if (statement.isExported()) {
                    isExported = true;
                }
            }
        });
        return hasExpectedIdentifier;
    });
    return {
        variableStatement: variableStatementWithExpectedIdentifier,
        isExported,
    };
};
exports.getVariableStatementWithExpectedIdentifier = getVariableStatementWithExpectedIdentifier;
//# sourceMappingURL=getVariableStatementWithExpectedIdentifier.js.map