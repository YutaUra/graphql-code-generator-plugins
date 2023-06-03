"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const fs = require("fs");
const devkit_1 = require("@nx/devkit");
const projectName = 'typescript-resolver-files-e2e';
const normalizeOptions = (tree, options) => {
    const testFullName = `test-${options.testName}`;
    const testDir = path.posix.join('packages', projectName, 'src', testFullName);
    if (fs.existsSync(testDir)) {
        throw new Error(`${testFullName} already exists. Try a different testName.`);
    }
    const projectConfig = (0, devkit_1.readProjectConfiguration)(tree, projectName);
    return Object.assign(Object.assign({}, options), { projectName,
        projectConfig,
        testFullName });
};
const addFiles = (tree, options) => {
    (0, devkit_1.generateFiles)(tree, path.posix.join(__dirname, 'files'), 'packages/typescript-resolver-files-e2e/src', Object.assign(Object.assign({}, options), { template: '' }));
};
const updateProjectConfig = (tree, options) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const e2eRunCommands = (_c = (_b = (_a = options.projectConfig.targets) === null || _a === void 0 ? void 0 : _a['e2e-run']) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c['commands'];
    if (!e2eRunCommands) {
        throw new Error('Unable to find `e2e-run` commands in project.json.');
    }
    const graphQLCodegenConfig = (_e = (_d = options.projectConfig.targets) === null || _d === void 0 ? void 0 : _d['graphql-codegen']) === null || _e === void 0 ? void 0 : _e.configurations;
    if (!graphQLCodegenConfig) {
        throw new Error('Unable to find `graphql-codegen` configurations in project.json.');
    }
    const e2eCleanupConfig = (_g = (_f = options.projectConfig.targets) === null || _f === void 0 ? void 0 : _f['e2e-cleanup']) === null || _g === void 0 ? void 0 : _g.configurations;
    if (!e2eCleanupConfig) {
        throw new Error('Unable to find `e2e-cleanup` configurations in project.json.');
    }
    e2eRunCommands.push(`nx graphql-codegen typescript-resolver-files-e2e -c ${options.testFullName} --verbose`);
    graphQLCodegenConfig[options.testFullName] = {
        configFile: `packages/typescript-resolver-files-e2e/src/${options.testFullName}/codegen.ts`,
    };
    e2eCleanupConfig[options.testFullName] = {
        commands: [
            `rimraf -g 'packages/typescript-resolver-files-e2e/src/${options.testFullName}/**/resolvers/'`,
            `rimraf -g 'packages/typescript-resolver-files-e2e/src/${options.testFullName}/**/*.generated.*'`,
        ],
        parallel: false,
    };
    (0, devkit_1.updateProjectConfiguration)(tree, options.projectName, options.projectConfig);
};
function default_1(tree, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const normalizedOptions = normalizeOptions(tree, options);
        addFiles(tree, normalizedOptions);
        updateProjectConfig(tree, normalizedOptions);
        yield (0, devkit_1.formatFiles)(tree);
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map