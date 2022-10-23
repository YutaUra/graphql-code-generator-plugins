import * as path from 'path';
import { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { mkdir, writeFile } from 'fs/promises';
import { run } from './run';
import { RunResult } from './types';

interface PluginConfig {
  resolverTypesPath: string;
}

export const plugin: PluginFunction<PluginConfig> = async (
  schema,
  _documents,
  config,
  info
) => {
  // TODO: check if there's a better way to handle output dir
  const baseOutputDir = info?.outputFile;
  if (!baseOutputDir) {
    throw new Error('Output folder is invalid');
  }
  const { resolverTypesPath: relativeResolverTypesPathFromBaseOutputDir } =
    config;
  const resolverTypesPath = path.join(
    baseOutputDir,
    relativeResolverTypesPathFromBaseOutputDir
  );

  const result: RunResult = {
    dirs: [],
    files: {},
  };
  run({ schema, baseOutputDir, resolverTypesPath }, result);

  // Write dirs and files
  await Promise.all(
    result.dirs.map(async (dir) => await mkdir(dir, { recursive: true }))
  );
  await Promise.all(
    Object.entries(result.files).map(
      async ([filePath, file]) => await writeFile(filePath, file.content)
    )
  );

  return { content: '' };
};
