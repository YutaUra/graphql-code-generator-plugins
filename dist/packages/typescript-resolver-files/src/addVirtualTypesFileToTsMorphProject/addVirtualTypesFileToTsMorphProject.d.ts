import type { GraphQLSchema } from 'graphql';
import { type SourceFile, Project } from 'ts-morph';
export declare const addVirtualTypesFileToTsMorphProject: ({ tsMorphProject, schemaAst, resolverTypesPath, resolverTypesConfig, }: {
    tsMorphProject: Project;
    schemaAst: GraphQLSchema;
    resolverTypesPath: string;
    resolverTypesConfig: Record<string, unknown>;
}) => Promise<SourceFile>;
