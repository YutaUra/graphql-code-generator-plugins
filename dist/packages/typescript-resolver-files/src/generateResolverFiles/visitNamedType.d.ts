import { GraphQLNamedType, Location } from 'graphql';
import { RootObjectType } from '../utils';
import { GraphQLTypeHandler, GenerateResolverFilesContext } from './types';
export interface VisitNamedTypeParams {
    namedType: GraphQLNamedType;
    resolverName: string;
    belongsToRootObject: RootObjectType | null;
    visitor: {
        RootObjectTypeField: GraphQLTypeHandler<RootObjectType>;
        ObjectType: GraphQLTypeHandler;
        ScalarType: GraphQLTypeHandler;
        UnionType: GraphQLTypeHandler;
        InterfaceType: GraphQLTypeHandler;
    };
    location?: Location;
}
export declare const visitNamedType: ({ namedType, resolverName, belongsToRootObject, location, visitor, }: VisitNamedTypeParams, ctx: GenerateResolverFilesContext) => void;
