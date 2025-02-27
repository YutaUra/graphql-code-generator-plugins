/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
import type { Resolvers } from './types.generated';
import { Error } from './base/resolvers/Error';
import { PaginationResult } from './base/resolvers/PaginationResult';
import { StandardError } from './base/resolvers/StandardError';
import { DateTimeResolver } from 'graphql-scalars';
export const resolvers: Resolvers = {
  Error: Error,
  PaginationResult: PaginationResult,
  StandardError: StandardError,
  DateTime: DateTimeResolver,
};
