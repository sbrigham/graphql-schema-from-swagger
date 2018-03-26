// Thanks to https://github.com/amir-s/graphql-distributed-schema/blob/master/graph.js

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLEnumType
} from 'graphql';

type ObjectType = "OBJECT" | "SCALAR" | "ENUM";

class DistributedSchema {
  constructor() {
    this.types = {};
  }

  createEnumType(name, obj = {}) {
    return this.types[name] = new GraphQLEnumType({
      name,
      values: obj.values
    });
  }

  createScalarType(name, obj = {}) {
    return this.types[name] = new GraphQLScalarType({
      name,
      description: obj.description,
      serialize: value => value,
      parseValue: value => value,
      parseLiteral: (ast) => {
        if (ast.kind !== Kind.OBJECT) {
          throw new GraphQLError(
            `Query error: Can only parse object but got a: ${ast.kind}`,
            [ast],
          );
        }
        return ast.value;
      },
    });
  }

  createType(name, obj = {}, objectType: ObjectType) {
    if(objectType === 'SCALAR') {
      return this.createScalarType(name, obj);
    }

    if(objectType === 'ENUM') {
      return this.createEnumType(name, obj);
    }
    return this.types[name] = new GraphQLObjectType({
      name,
      description: obj.description,
      args: obj.args,
      fields: obj.fields || {}
    });
  }

  type(name, obj, objectType: ObjectType) {
    if (this.types[name])
      return this.types[name];

    return this.createType(name, obj, objectType);
  }

  generateSchema() : GraphQLSchema {
    const { Query, ...types} = this.types;
    return new GraphQLSchema({
      query: Query,
      types: Object.values(types)
    });
  }
}

export default DistributedSchema;
