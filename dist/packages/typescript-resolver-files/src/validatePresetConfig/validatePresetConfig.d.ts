import * as typeScriptPlugin from '@graphql-codegen/typescript';
import * as typeScriptResolversPlugin from '@graphql-codegen/typescript-resolvers';
import type { ProjectOptions } from 'ts-morph';
type ParsedTypesPluginsConfig = Omit<typeScriptPlugin.TypeScriptPluginConfig & typeScriptResolversPlugin.TypeScriptResolversPluginConfig, 'scalars' | 'emitLegacyCommonJSImports'>;
type ConfigMode = 'merged' | 'modules';
type ResolverMainFileMode = 'merged' | 'modules';
export type TypeDefsFileMode = 'merged' | 'mergedWhitelisted' | 'modules';
type FixObjectTypeResolvers = 'smart' | 'disabled';
export type ScalarsOverridesType = string | {
    input: string;
    output: string;
};
export interface ParsedPresetConfig {
    resolverTypesPath: string;
    resolverRelativeTargetDir: string;
    resolverMainFile: string;
    resolverMainFileMode: ResolverMainFileMode;
    typeDefsFilePath: string | false;
    typeDefsFileMode: TypeDefsFileMode;
    mappersFileExtension: string;
    mappersSuffix: string;
    scalarsModule: string | false;
    scalarsOverrides: Record<string, {
        resolver?: string;
        type?: ScalarsOverridesType;
    }>;
    mode: ConfigMode;
    whitelistedModules: string[];
    blacklistedModules: string[];
    externalResolvers: Record<string, string>;
    typesPluginsConfig: ParsedTypesPluginsConfig;
    tsMorphProjectOptions: ProjectOptions;
    fixObjectTypeResolvers: FixObjectTypeResolvers;
    emitLegacyCommonJSImports: boolean;
}
export interface RawPresetConfig {
    resolverTypesPath?: string;
    resolverRelativeTargetDir?: string;
    resolverMainFile?: string;
    resolverMainFileMode?: string;
    typeDefsFilePath?: string | boolean;
    typeDefsFileMode?: string;
    mappersFileExtension?: string;
    mappersSuffix?: string;
    scalarsModule?: string | boolean;
    scalarsOverrides?: Record<string, {
        resolver?: string;
        type?: ScalarsOverridesType;
    }>;
    mode?: string;
    whitelistedModules?: string[];
    blacklistedModules?: string[];
    externalResolvers?: Record<string, string>;
    typesPluginsConfig?: typeScriptPlugin.TypeScriptPluginConfig & typeScriptResolversPlugin.TypeScriptResolversPluginConfig;
    tsConfigFilePath?: string;
    fixObjectTypeResolvers?: string;
    emitLegacyCommonJSImports?: boolean;
}
export interface TypedPresetConfig extends RawPresetConfig {
    mode?: ConfigMode;
    resolverMainFileMode?: ResolverMainFileMode;
    typeDefsFileMode?: TypeDefsFileMode;
    fixObjectTypeResolvers?: FixObjectTypeResolvers;
    typesPluginsConfig?: ParsedTypesPluginsConfig;
}
export declare const validatePresetConfig: ({ resolverTypesPath, resolverRelativeTargetDir, resolverMainFile, resolverMainFileMode, typeDefsFilePath, typeDefsFileMode: inputTypeDefsFileMode, mappersFileExtension, mappersSuffix, scalarsModule, scalarsOverrides, mode, whitelistedModules, blacklistedModules, externalResolvers, typesPluginsConfig, tsConfigFilePath, fixObjectTypeResolvers, emitLegacyCommonJSImports, }: RawPresetConfig) => ParsedPresetConfig;
export {};
