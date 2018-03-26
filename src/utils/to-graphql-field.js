import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLEnumType
} from 'graphql';

export function isPrimitiveType(type: string) {
  return type === 'integer' || type === 'number' || type === 'string' || type === 'boolean';
}

export function toPrimitiveType({
  type,
  name,
  isRequired = false,
  enumValues,
  distributedSchema
}) {
  if (enumValues) {
    const enumType = distributedSchema.type(name, {
      name,
      values: enumValues.reduce((acc, current) => {
        acc[current] = { value: current };
        return acc;
      }, {})
    }, 'ENUM')
    return isRequired ? new GraphQLNonNull(enumType) : enumType
  }

  switch (type) {
    case 'integer':
    case 'number':
      return isRequired ? new GraphQLNonNull(GraphQLInt) : GraphQLInt;
    case 'string':
      return isRequired ? new GraphQLNonNull(GraphQLString) : GraphQLString;
    case 'boolean':
      return isRequired ? new GraphQLNonNull(GraphQLBoolean) : GraphQLBoolean;
    default:
      throw new Error('Dont know how to handle this type yet...');
  }
}
