import type { Types } from '@graphql-codegen/plugin-helpers';
import type { TypedPresetConfig } from './validatePresetConfig';
export declare const defineConfig: (presetConfig?: TypedPresetConfig, context?: {
    baseOutputDir: string;
}) => Pick<Types.ConfiguredOutput, 'preset' | 'presetConfig' | 'watchPattern'>;
