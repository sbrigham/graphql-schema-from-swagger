import Pluralize from 'pluralize';
import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';

export default (strategy, distributedSchema, entityName) => {
  switch (strategy) {
    case 'SIMPLE':
      return distributedSchema.type(`${Pluralize(entityName)}`, {
          name: `${Pluralize(entityName)}`,
          fields: {
            totalItems: {
              type: new GraphQLNonNull(GraphQLInt),
            },
            items: {
              type: new GraphQLList(distributedSchema.type(entityName)),
            },
          },
        });
      break;
    default:
      return new GraphQLList(distributedSchema.type(entityName));
  }
}
