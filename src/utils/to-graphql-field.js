import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} from 'graphql';

export function isPrimitiveType(type: string) {
  return type === 'integer' || type === 'string' || type === 'boolean';
}

export function toPrimitiveType(type: string, isRequired: boolean = false) {
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
