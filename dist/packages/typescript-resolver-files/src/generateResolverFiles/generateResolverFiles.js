"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResolverFiles = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("../utils");
const addResolverMainFiles_1 = require("./addResolverMainFiles");
const postProcessFiles_1 = require("./postProcessFiles");
const handleGraphQLRootObjectTypeField_1 = require("./handleGraphQLRootObjectTypeField");
const handleGraphQLObjectType_1 = require("./handleGraphQLObjectType");
const handleGraphQLUnionType_1 = require("./handleGraphQLUnionType");
const handleGraphQLScalarType_1 = require("./handleGraphQLScalarType");
const handleGraphQLInterfaceType_1 = require("./handleGraphQLInterfaceType");
const visitNamedType_1 = require("./visitNamedType");
const generateResolverFiles = (ctx) => {
    Object.entries(ctx.config.schema.getTypeMap()).forEach(([schemaType, namedType]) => {
        var _a;
        if ((0, utils_1.isNativeNamedType)(namedType)) {
            return;
        }
        //
        // "Visitor" pattern
        //
        const visitor = {
            RootObjectTypeField: handleGraphQLRootObjectTypeField_1.handleGraphQLRootObjectTypeField,
            ObjectType: handleGraphQLObjectType_1.handleGraphQLObjectType,
            UnionType: handleGraphQLUnionType_1.handleGraphQLUnionType,
            ScalarType: handleGraphQLScalarType_1.handleGraphQLScalarType,
            InterfaceType: handleGraphQLInterfaceType_1.handleGraphQLInterfaceType,
        };
        if ((0, utils_1.isRootObjectType)(schemaType) && (0, graphql_1.isObjectType)(namedType)) {
            Object.entries(namedType.getFields()).forEach(([fieldName, fieldNode]) => {
                var _a;
                return (0, visitNamedType_1.visitNamedType)({
                    namedType,
                    resolverName: fieldName,
                    belongsToRootObject: schemaType,
                    location: (_a = fieldNode.astNode) === null || _a === void 0 ? void 0 : _a.loc,
                    visitor,
                }, ctx);
            });
            return;
        }
        (0, visitNamedType_1.visitNamedType)({
            namedType,
            resolverName: namedType.name,
            belongsToRootObject: null,
            location: (_a = namedType.astNode) === null || _a === void 0 ? void 0 : _a.loc,
            visitor,
        }, ctx);
    });
    // Post process generated files (could be existing files or files to be generated)
    (0, postProcessFiles_1.postProcessFiles)(ctx);
    // Put all resolvers into barrel file/s (or main file/s)
    (0, addResolverMainFiles_1.addResolverMainFiles)(ctx);
};
exports.generateResolverFiles = generateResolverFiles;
//# sourceMappingURL=generateResolverFiles.js.map