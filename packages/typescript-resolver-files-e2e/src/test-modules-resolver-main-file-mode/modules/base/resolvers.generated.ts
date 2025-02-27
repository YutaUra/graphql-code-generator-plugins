/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
import type { Resolvers } from './../types.generated';
import { Error } from './resolvers/Error';
import { PaginationResult } from './resolvers/PaginationResult';
import { StandardError } from './resolvers/StandardError';
import { DateTimeResolver } from 'graphql-scalars';
export const resolvers: Resolvers = {
  Error: Error,
  PaginationResult: PaginationResult,
  StandardError: StandardError,
  DateTime: DateTimeResolver,
};
