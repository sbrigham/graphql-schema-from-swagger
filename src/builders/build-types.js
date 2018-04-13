import toCamelCase from 'camelcase';
import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList,
  GraphQLScalarType,
} from 'graphql';

import { toPrimitiveType, isPrimitiveType } from '../utils/to-graphql-field';
import DistributedSchema from '../utils/distributed-schema';
import { Entity } from '../utils/swagger-parser';
import { type EntityArguments } from '../builders/build-arguments';

function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class GenerateTypes {
  constructor(distributedSchema, graphqlArguments, entities) {
    this.distributedSchema = distributedSchema;
    this.graphqlArguments = graphqlArguments;
    this.entities = entities;
  }

  toGraphqlField(property: Object, forEntityName: string) {
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
            }),
          };
        }
        if (additionalProperties) {
          if (
            additionalProperties.type === 'object' ||
            additionalProperties['$ref']
          ) {
            return {
              type: this.distributedSchema.type(
                capFirstLetter(property.name),
                {},
                'SCALAR',
              ),
            };
          }
          return {
            type: toPrimitiveType({
              type: additionalProperties.type,
              isRequired: location === 'path',
            }),
          };
        }
        throw new Error('Dont know how to handle this type yet...');
      case 'integer':
      case 'number':
      case 'string':
      case 'boolean':
        return {
          type: toPrimitiveType({ type, isRequired: location === 'path' }),
        };
      case 'array':
        if (isPrimitiveType(items.type)) {
          return {
            type: new GraphQLList(toPrimitiveType({ type: items.type })),
          };
        }

        // need the parent entity?
        const arrayEntityName = items.$ref;
        if (!this.entities.some(e => e.name === arrayEntityName)) {
          throw new Error(
            `Array entity ${arrayEntityName} not found while generating types`,
          );
        }

        let arrayType = null;
        const forEntity = this.entities.find(e => e.name == forEntityName);

        // This needs to turn into... a new bit which means the entity does not belong to a fullEntity
        if (
          forEntity.parentEntityName === null &&
          !forEntity.endpoints.list &&
          !forEntity.endpoints.single
        ) {
          return {
            type: new GraphQLList(this.distributedSchema.type(arrayEntityName)),
            args: {},
          };
        }

        const arrayEntity = this.entities.find(e => e.name == arrayEntityName);

        if (
          arrayEntity.endpoints.list &&
          arrayEntity.endpoints.list.listEntityName
        ) {
          arrayType = this.distributedSchema.type(
            arrayEntity.endpoints.list.listEntityName,
          );
        } else {
          arrayType = new GraphQLList(
            this.distributedSchema.type(arrayEntityName),
          );
        }

        return {
          type: arrayType,
          args: this.graphqlArguments[arrayEntityName].list['type'],
        };
      case undefined:
        const entityName = $ref;
        const args =
          this.graphqlArguments[entityName] &&
          this.graphqlArguments[entityName].single
            ? this.graphqlArguments[entityName].single['type']
            : {};
        return {
          type: this.distributedSchema.type(entityName),
          args,
        };
      default:
        throw new Error('type not defined');
    }
  }

  fieldsFromParameters(swaggerParameters: Array<Object>, entityName: string) {
    const fields = {};
    swaggerParameters.map(parameter => {
      fields[toCamelCase(parameter.name)] = this.toGraphqlField(
        parameter,
        entityName,
      );
    });
    return fields;
  }

  generate() {
    this.entities.map(entity => {
      this.distributedSchema.type(entity.name, {
        name: entity.name,
        fields: () =>
          this.fieldsFromParameters(
            Object.keys(entity.properties).map(key => ({
              ...entity.properties[key],
              name: key,
            })),
            entity.name,
          ),
      });
    });
  }
}

export default (
  entities: Array<Entity>,
  distributedSchema: DistributedSchema,
  graphqlArguments: EntityArguments,
) => {
  new GenerateTypes(distributedSchema, graphqlArguments, entities).generate();
  return distributedSchema;
};
