// Thanks to https://github.com/amir-s/graphql-distributed-schema/blob/master/graph.js

import { GraphQLSchema, GraphQLObjectType } from 'graphql';

class DistributedSchema {
  constructor() {
    this.types = {};
  }

  createType(name, obj = {}) {
    return this.types[name] = new GraphQLObjectType({
      name,
      description: obj.description,
      args: obj.args,
      fields: obj.fields || {}
    });
  }

  type(name, obj) {
    if (this.types[name])
      return this.types[name];

    return this.createType(name, obj);
  }

  generateSchema() : GraphQLSchema {
    const { query, ...types} = this.types;
    return new GraphQLSchema({
      query,
      types: Object.values(types)
    });
  }
}

export default DistributedSchema;
