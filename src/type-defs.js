// @flow
import { type Entity } from './utils/swagger-parser';

import DistributedSchema from './utils/distributed-schema';
import buildArguments from './builders/build-arguments';
import buildTypes from './builders/build-types';
import buildRootQuery from './builders/build-root-query';

export function generateTypeDefs(entities: Array<Entity>) {
  var distributedSchema = new DistributedSchema();
  const graphQlArguments = buildArguments(entities, distributedSchema);
  buildTypes(entities, distributedSchema, graphQlArguments);
  buildRootQuery(entities, distributedSchema, graphQlArguments);
  return distributedSchema.generateSchema();
}
