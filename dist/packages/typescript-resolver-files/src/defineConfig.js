"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineConfig = void 0;
const path = require("path");
const preset_1 = require("./preset");
const defineConfig = (presetConfig = {}, context = { baseOutputDir: '' }) => {
    const { baseOutputDir } = context;
    const mappersFileExtension = presetConfig.mappersFileExtension || '.mappers.ts';
    const watchPattern = [];
    const mapperWatchPattern = path.posix.join(baseOutputDir, '**', `*${mappersFileExtension}`);
    watchPattern.push(mapperWatchPattern);
    return {
        preset: preset_1.preset,
        presetConfig,
        watchPattern,
    };
};
exports.defineConfig = defineConfig;
//# sourceMappingURL=defineConfig.js.map