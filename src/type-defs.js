// @flow
import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  printSchema,
} from 'graphql';

import { type Entity } from './swagger-parser';

import toCamelCase from 'camelcase';
import Pluralize from 'pluralize';

import DistributedSchema from './distributed-schema';
import SwaggerParser, { type SwaggerParserOptions } from './swagger-parser';

const graph = new DistributedSchema();

function isPrimitiveType(type: string) {
  return type === 'integer' || type === 'string' || type === 'boolean';
}

function toPrimitiveType(type: string, isRequired: boolean = false) {
  switch (type) {
    case 'integer':
      return isRequired ? new GraphQLNonNull(GraphQLInt) : GraphQLInt;
    case 'string':
      return isRequired ? new GraphQLNonNull(GraphQLString) : GraphQLString;
    case 'boolean':
      return isRequired ? new GraphQLNonNull(GraphQLBoolean) : GraphQLBoolean;
    default:
      throw new Error('Type is not a primitive');
  }
}

export function toGraphqlField(
  property: Object,
  allGraphqlArguments: Object,
  isRootQuery: boolean = false
) {
  const {
    args = {},
    type,
    $ref,
    items,
    properties,
    name,
    additionalProperties,
    in: location,
  } = property;

  switch (type) {
    case 'object':
      if (properties) {
        return {
          type: new GraphQLObjectType({
            name,
            fields: fieldsFromParameters(
              Object.keys(properties).map(key => ({
                ...properties[key],
                name: key,
              })),
              allGraphqlArguments,
              isRootQuery
            ),
          }),
        };
      }
      if (additionalProperties) {
        return {
          type: toPrimitiveType(
            additionalProperties.type,
            isRootQuery && location === 'path'
          ),
        };
      }
      throw new Error('Dont know how to handle this type yet...');
    case 'integer':
      return {
        type: toPrimitiveType(type, isRootQuery && location === 'path'),
      };
    case 'number':
      return {
        type: toPrimitiveType('integer', isRootQuery && location === 'path'),
      };
    case 'string':
      return {
        type: toPrimitiveType(type, isRootQuery && location === 'path'),
      };
    case 'boolean':
      return {
        type: toPrimitiveType(type, isRootQuery && location === 'path'),
      };
    case 'array':
      if (isPrimitiveType(items.type)) {
        return {
          type: new GraphQLList(toPrimitiveType(items.type)),
        };
      }
      const arrayEntityName = items.$ref.replace('#/definitions/', '');
      return {
        type: new GraphQLList(graph.type(arrayEntityName)),
        args:
          allGraphqlArguments[arrayEntityName].list[
            isRootQuery ? 'root' : 'type'
          ],
      };
    case undefined:
      const entityName = $ref.replace('#/definitions/', '');
      return {
        type: graph.type(entityName),
        args:
          allGraphqlArguments[entityName].single[isRootQuery ? 'root' : 'type'],
      };
    default:
      throw new Error('type not defined');
  }
}

export function fieldsFromParameters(
  swaggerParameters: Array<Object>,
  allGraphqlArguments: Object = {},
  isRootQuery: boolean = false
) {
  const fields = {};
  swaggerParameters.map(parameter => {
    fields[toCamelCase(parameter.name)] = toGraphqlField(
      parameter,
      allGraphqlArguments,
      isRootQuery
    );
  });
  return fields;
}

export function generateArguments(
  swaggerParameters: Object,
  isRootQuery: boolean
) {
  const requiredArguments = swaggerParameters.filter(p => p.required);

  const deDupedParameters = requiredArguments;
  swaggerParameters.map(p => {
    if (
      !deDupedParameters.some(
        dda => dda.name.toLowerCase() === p.name.toLowerCase()
      )
    ) {
      deDupedParameters.push(p);
    }
  });
  return fieldsFromParameters(deDupedParameters, {}, isRootQuery);
}

export function generateTypeDefs(entities: Array<Entity>) {
  graph.clear();

  // Create inputs
  const graphQlArguments = entities.reduce((acc, entity) => {
    acc[entity.name] = {
      list: {
        root: {},
        type: {},
      },
      single: {
        root: {},
        type: {},
      },
    };

    if (entity.endpoints.list) {
      acc[entity.name].list.root = generateArguments(
        entity.endpoints.list.parameters,
        true
      );
      acc[entity.name].list.type = generateArguments(
        entity.endpoints.list.parameters,
        false
      );
    }

    if (entity.endpoints.single) {
      acc[entity.name].single.root = generateArguments(
        entity.endpoints.single.parameters,
        true
      );
      acc[entity.name].single.type = generateArguments(
        entity.endpoints.single.parameters,
        false
      );
    }
    return acc;
  }, {});

  // Create dummy types
  entities.map(entity => {
    graph.type(entity.name, {
      name: entity.name,
      fields: () => {},
    });
  });

  // Add relationships to dummy types
  entities.map(entity => {
    graph.type(entity.name).extend(() =>
      fieldsFromParameters(
        Object.keys(entity.properties).map(key => ({
          ...entity.properties[key],
          name: key,
        })),
        graphQlArguments,
        false
      )
    );
  });

  const rootQuery = graph.type('query').extend(() =>
    entities.reduce((acc, entity) => {
      if (entity.endpoints.list) {
        const singularEntityType = graph.type(entity.name);
        const type = new GraphQLList(singularEntityType);
        acc[Pluralize(toCamelCase(entity.name))] = {
          type,
          args: graphQlArguments[entity.name].list.root,
        };
      }

      if (entity.endpoints.single) {
        const type = graph.type(entity.name);
        acc[toCamelCase(entity.name)] = {
          type,
          args: graphQlArguments[entity.name].single.root,
        };
      }
      return acc;
    }, {})
  );

  return graph.generate();
}
