"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addExternalResolverImport = void 0;
const utils_1 = require("../utils");
const addExternalResolverImport = (params, { result, config: { emitLegacyCommonJSImports }, }) => {
    const { importIdentifier, identifierUsage, moduleImport } = parseImportSyntax(params);
    result.externalImports[moduleImport] =
        result.externalImports[moduleImport] ||
            {
                moduleName: params.moduleName,
                importLineMeta: {
                    isTypeImport: false,
                    module: moduleImport,
                    moduleType: 'preserve',
                    namedImports: [],
                    defaultImport: undefined,
                    emitLegacyCommonJSImports,
                },
                identifierUsages: [],
            };
    const externalImport = result.externalImports[moduleImport];
    switch (importIdentifier.__type) {
        case 'default':
            if (externalImport.importLineMeta.defaultImport &&
                externalImport.importLineMeta.defaultImport !==
                    importIdentifier.defaultImport) {
                throw new Error(`There can be only one default import from '${moduleImport}'. Current: ${externalImport.importLineMeta.defaultImport}. New: ${importIdentifier.defaultImport}`);
            }
            externalImport.importLineMeta.defaultImport =
                importIdentifier.defaultImport;
            break;
        case 'named':
            externalImport.importLineMeta.namedImports.push(importIdentifier.namedImport);
            break;
        case 'namedWithAlias':
            externalImport.importLineMeta.namedImports.push({
                propertyName: importIdentifier.propertyName,
                identifierName: importIdentifier.identifierName,
            });
            break;
        default:
            // importIdentifier is `never` unless new __type is added
            // i.e. this is here for typesafety
            return importIdentifier;
    }
    externalImport.identifierUsages.push(identifierUsage);
};
exports.addExternalResolverImport = addExternalResolverImport;
const parseImportSyntax = ({ configImportSyntax, normalizedResolverName, }) => {
    const isAbsoluteImport = configImportSyntax[0] === '~';
    const importStringWithoutRelativity = isAbsoluteImport
        ? configImportSyntax.slice(1)
        : configImportSyntax;
    const [rawModuleName, importIdentifier] = importStringWithoutRelativity.split('#');
    const moduleImport = isAbsoluteImport
        ? rawModuleName
        : (0, utils_1.normalizeRelativePath)(rawModuleName);
    if (importIdentifier.startsWith('default')) {
        if (!importIdentifier.startsWith('default as ')) {
            throw new Error(`Invalid import syntax. "${configImportSyntax}": Default import must include identifier name e.g. moduleName#default as Identifier`);
        }
        const [_, defaultImportIdentifier] = importIdentifier.split('default as ');
        return {
            importIdentifier: {
                __type: 'default',
                defaultImport: defaultImportIdentifier,
            },
            identifierUsage: {
                identifierName: defaultImportIdentifier,
                normalizedResolverName,
            },
            moduleImport,
        };
    }
    const namedImportParts = importIdentifier.split(' as ');
    if (namedImportParts.length === 1) {
        return {
            importIdentifier: {
                __type: 'named',
                namedImport: namedImportParts[0],
            },
            identifierUsage: {
                identifierName: namedImportParts[0],
                normalizedResolverName,
            },
            moduleImport,
        };
    }
    return {
        importIdentifier: {
            __type: 'namedWithAlias',
            propertyName: namedImportParts[0],
            identifierName: namedImportParts[1],
        },
        identifierUsage: {
            identifierName: namedImportParts[1],
            normalizedResolverName,
        },
        moduleImport,
    };
};
//# sourceMappingURL=addExternalResolverImport.js.map