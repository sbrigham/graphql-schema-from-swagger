import toCamelCase from 'camelcase';
import Pluralize from 'pluralize';
import {
  GraphQLList,
} from 'graphql';
import { Entity } from '../utils/swagger-parser';
import DistributedSchema from '../utils/distributed-schema';
import { type EntityArguments } from '../builders/build-arguments';

export default (entities: Array<Entity>, graph: DistributedSchema, graphQlArguments: EntityArguments) => {
  const rootQuery = graph.type('Query', {
    fields: () => entities.reduce((acc, entity) => {
      if (entity.endpoints.single) {
        acc[toCamelCase(entity.name)] = {
          type: graph.type(entity.name),
          args: graphQlArguments[entity.name].single.root,
        }
      }

      if (entity.endpoints.list) {
        const listEntityName = entity.endpoints.list.listEntityName;
        acc[Pluralize(toCamelCase(entity.name))] = {
          type: listEntityName ? graph.type(listEntityName) : new GraphQLList(graph.type(entity.name)),
          args: graphQlArguments[entity.name].list.root,
        }
      }
      return acc;
    }, {}),
  });
};
