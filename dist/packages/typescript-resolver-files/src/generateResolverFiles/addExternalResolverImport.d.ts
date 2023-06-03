import type { GenerateResolverFilesContext } from './types';
interface AddExternalResolverImportParams {
    moduleName: string;
    normalizedResolverName: string;
    configImportSyntax: string;
}
export declare const addExternalResolverImport: (params: AddExternalResolverImportParams, { result, config: { emitLegacyCommonJSImports }, }: GenerateResolverFilesContext) => void;
export {};
