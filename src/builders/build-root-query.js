import toCamelCase from 'camelcase';
import Pluralize from 'pluralize';
import handleRootTypePagination from '../utils/pagination-strategy-handler';
import { Entity } from '../utils/swagger-parser';
import DistributedSchema from '../utils/distributed-schema';
import { type EntityArguments } from '../builders/build-arguments';

export default (entities: Array<Entity>, graph: DistributedSchema, graphQlArguments: EntityArguments) => {
  const rootQuery = graph.type('query', {
    fields: () => entities.reduce((acc, entity) => {
      if (entity.endpoints.list) {
        acc[Pluralize(toCamelCase(entity.name))] = {
          type: handleRootTypePagination(entity.paginationStrategy, graph, entity.name),
          args: graphQlArguments[entity.name].list.root
        }
      }

      if (entity.endpoints.single) {
        acc[toCamelCase(entity.name)] = {
          type: graph.type(entity.name),
          args: graphQlArguments[entity.name].single.root,
        };
      }
      return acc;
    }, {}),
  });
};
