
import toCamelCase from 'camelcase';
import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';

import { toPrimitiveType, isPrimitiveType } from '../utils/to-graphql-field';
import handleRootTypePagination from '../utils/pagination-strategy-handler';
import DistributedSchema from '../utils/distributed-schema';
import { Entity } from '../utils/swagger-parser';
import { type EntityArguments } from '../builders/build-arguments';


function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class GenerateTypes {
  constructor(distributedSchema, graphqlArguments) {
    this.distributedSchema = distributedSchema;
    this.graphqlArguments = graphqlArguments;
  }

  toGraphqlField(
    property: Object,
    paginationStrategy?: PaginationStrategy
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
            type: this.distributedSchema.type(capFirstLetter(name), {
              fields: this.fieldsFromParameters(
                Object.keys(properties).map(key => ({
                  ...properties[key],
                  name: key,
                })),
              ),
            })
          };
        }
        if (additionalProperties) {
          return {
            type: toPrimitiveType(
              additionalProperties.type,
              location === 'path'
            ),
          };
        }
        throw new Error('Dont know how to handle this type yet...');
      case 'integer':
      case 'number':
      case 'string':
      case 'boolean':
        return {
          type: toPrimitiveType(type, location === 'path'),
        };
      case 'array':
        if (isPrimitiveType(items.type)) {
          return {
            type: new GraphQLList(toPrimitiveType(items.type)),
          };
        }

        const arrayEntityName = items.$ref.replace('#/definitions/', '');
        return {
          type: handleRootTypePagination(paginationStrategy, this.distributedSchema, arrayEntityName),
          args:
            this.graphqlArguments[arrayEntityName].list['type'],
        };
      case undefined:
        const entityName = $ref.replace('#/definitions/', '');
        return {
          type: this.distributedSchema.type(entityName),
          args:
            this.graphqlArguments[entityName].single['type'],
        };
      default:
        throw new Error('type not defined');
    }
  }

  fieldsFromParameters(
    swaggerParameters: Array<Object>,
    paginationStrategy?: PaginationStrategy
  ) {
    const fields = {};
    swaggerParameters.map(parameter => {
      fields[toCamelCase(parameter.name)] = this.toGraphqlField(
        parameter,
        this.distributedSchema,
        this.graphqlArguments,
        false,
        paginationStrategy
      );
    });
    return fields;
  }

  generate(entities) {
    entities.map(entity => {
      this.distributedSchema.type(entity.name, {
        name: entity.name,
        fields: () => this.fieldsFromParameters(
          Object.keys(entity.properties).map(key => ({
            ...entity.properties[key],
            name: key,
          })),
          entity.paginationStrategy
        ),
      });
    });
  }
}

export default (entities: Array<Entity>, distributedSchema: DistributedSchema, graphqlArguments: EntityArguments) => {
  (new GenerateTypes(distributedSchema, graphqlArguments)).generate(entities);
  return distributedSchema;
}
