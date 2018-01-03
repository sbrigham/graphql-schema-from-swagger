// @flow

import { type Entity } from './swagger-parser';
import Pluralize from 'pluralize';
import toCamelCase from 'camelcase';

function resolverFuction(apiResolver: Function, rawUrl: string, parentType: string, type: string, fieldName: string) {
  return async (parent, parameters, context) => {
    return apiResolver({
      parent,
      parentType,
      parameters,
      rawUrl,
      fieldName,
      type,
      context,
    });
  };
}

export function genResolvers(entities: Array<Entity>) {
  const resolvers = {};
  entities.forEach(e => {
    resolvers[e.name] = Object.keys(e.relationships).reduce((acc, current) => {
      const entity = e.relationships[current];

      const fullEntity = entities.find(e => e.name === entity.name);

      if (!fullEntity) throw new Error(`Relationship ${e.relationships[current].name} was not found for ${e.name}`);

      const endpoint = fullEntity.endpoints[entity.isList ? 'list' : 'single'];

      if (!endpoint) return acc;

      acc[current] = resolverFuction(
        fullEntity.mainResolver,
        endpoint.url,
        e.name,
        fullEntity.name,
        current,
      );
      return acc;
    }, {});
  });

  // Root query resolvers
  resolvers['Query'] = entities.reduce((acc, entity) => {
    const endpoints = entity.endpoints;
    if (endpoints.single) {
      acc[toCamelCase(entity.name)] = resolverFuction(
        entity.mainResolver,
        endpoints.single.url,
        entity.parentEntityName,
        entity.name,
        entity.name,
      );
    }

    if (endpoints.list) {
      acc[Pluralize(toCamelCase(entity.name))] = resolverFuction(
        entity.mainResolver,
        endpoints.list.url,
        entity.parentEntityName,
        entity.name,
        entity.name,
      );
    }

    return acc;
  }, {});
  return resolvers;
}
