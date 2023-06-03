"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndMergeParsedConfigs = void 0;
const utils_1 = require("../utils");
const nativeScalarTypes = {
    ID: { input: 'string', output: 'string | number' },
};
/**
 * validateAndMergeParsedConfigs is used to make sure all parsed configs do not incorrectly override each other.
 * Use this to ensure there's only one way of doing something. e.g.
 *   - scalarsOverrides must be used over externalResolvers to override scalars
 */
const validateAndMergeParsedConfigs = ({ externalResolvers, parsedGraphQLSchemaMeta: { userDefinedSchemaTypeMap, pluginsConfig: { defaultScalarExternalResolvers, defaultScalarTypesMap, defaultTypeMappers, }, }, }) => {
    Object.keys(externalResolvers).forEach((schemaType) => {
        if (userDefinedSchemaTypeMap.scalar[schemaType]) {
            throw new Error(utils_1.fmt.error(`Scalar "${schemaType}" found in presetConfig.externalResolvers. Use presetConfig.scalarsOverrides to override scalar implementation and type. Remove "${schemaType}" from presetConfig.externalResolvers.`, 'Validation'));
        }
    });
    return {
        userDefinedSchemaTypeMap,
        externalResolvers: Object.assign(Object.assign({}, defaultScalarExternalResolvers), externalResolvers),
        scalarTypes: Object.assign(Object.assign({}, nativeScalarTypes), defaultScalarTypesMap),
        typeMappers: defaultTypeMappers,
    };
};
exports.validateAndMergeParsedConfigs = validateAndMergeParsedConfigs;
//# sourceMappingURL=validateAndMergeParsedConfigs.js.map