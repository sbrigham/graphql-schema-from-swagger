// @flow
import { type Entity, type PaginationStrategy } from '../utils/swagger-parser';
import { toPrimitiveType } from '../utils/to-graphql-field';

import {
  GraphQLList,
} from 'graphql';

import toCamelCase from 'camelcase';

export type Argument = {
  root: Object,
  type: Object
}

export type EntityArgument = {
  list: EntityArgument,
  single: EntityArgument
}

export type EntityArguments = { [string]: EntityArgument };

class GenerateArguments {
  distributedSchema: Object;
  constructor(distributedSchema) {
    this.distributedSchema = distributedSchema;
  }

  toGraphqlField(
    property: Object,
    allGraphqlArguments: Object,
    isRootQuery: boolean = false,
    paginationStrategy?: PaginationStrategy
  ) {
    const {
      type,
      items,
      properties,
      in: location,
    } = property;

    return {
      type: type === 'array' ?
        new GraphQLList(toPrimitiveType(items.type, isRootQuery && location === 'path')):
        toPrimitiveType(type, isRootQuery && location === 'path')
    };
  }

  fieldsFromParameters(
    swaggerParameters: Array<Object>,
    allGraphqlArguments: Object = {},
    isRootQuery: boolean = false,
    paginationStrategy?: PaginationStrategy
  ) {
    const fields = {};
    swaggerParameters.map(parameter => {
      fields[toCamelCase(parameter.name)] = this.toGraphqlField(
        parameter,
        allGraphqlArguments,
        isRootQuery,
        paginationStrategy
      );
    });
    return fields;
  }

  generateArguments(
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
    return this.fieldsFromParameters(deDupedParameters, {}, isRootQuery);
  }

  generate(entities: Array<Entity>): EntityArguments {
    return entities.reduce((acc, entity) => {
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
        acc[entity.name].list.root = this.generateArguments(
          entity.endpoints.list.parameters,
          true
        );
        acc[entity.name].list.type = this.generateArguments(
          entity.endpoints.list.parameters,
          false
        );
      }

      if (entity.endpoints.single) {
        acc[entity.name].single.root = this.generateArguments(
          entity.endpoints.single.parameters,
          true
        );
        acc[entity.name].single.type = this.generateArguments(
          entity.endpoints.single.parameters,
          false
        );
      }
      return acc;
    }, {});
  }
}

export default (entities: Array<Entity>, distributedSchema: Object): EntityArguments => {
  return (new GenerateArguments(distributedSchema)).generate(entities);
}
