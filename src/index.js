// @flow

import { printSchema } from 'graphql';
import { genResolvers } from './resolvers';
import { generateTypeDefs } from './type-defs';
import SwaggerParser, {
  type SwaggerParserOptions,
  type Entity
} from './utils/swagger-parser';

/**
 * Returns an array of objects where each object has
 * a name, and the relationships that have endpoints defined for it
 * @param {object} swaggerJson
 * @returns {array}
 */
export function generateResolvers(
  swaggerJson: Object,
  options: SwaggerParserOptions
): Object {
  const swaggerParser = new SwaggerParser(swaggerJson, options);
  return genResolvers(swaggerParser.getEntities());
}

export function generateTypes(
  swaggerJson: Object,
  options: SwaggerParserOptions
) {
  const swaggerParser = new SwaggerParser(swaggerJson, options);
  return generateTypeDefs(swaggerParser.getEntities());
}

export function generate(swaggerJson: Object, options: SwaggerParserOptions) {
  const typeDefs = generateTypes(swaggerJson, options);
  var apolloReadySchema = {
    typeDefs: printSchema(typeDefs),
    resolvers: generateResolvers(swaggerJson, options),
  };
  return apolloReadySchema;
}

export type SwaggerApiType = {
  swaggerJson: Object,
  options: SwaggerParserOptions,
};

export function schemaFromMultiple(swaggerApis: Array<SwaggerApiType>) {
  const apiEntities = swaggerApis.map(({ swaggerJson, options }) =>
    new SwaggerParser(swaggerJson, options).getEntities()
  );

  const mergedEntities = mergeEntities(apiEntities);

  return {
    typeDefs: printSchema(generateTypeDefs(mergedEntities)),
    resolvers: genResolvers(mergedEntities),
  };
}

/*
  Merge the entities from multiple schemas into a single array of entities
  Using the key "Name" it will take the latest entity that has a resolver defined for it.
*/
function mergeEntities(multipleApiEntities: Array<Array<Entity>>): Array<any> {
  const mergedEntites = {};

  multipleApiEntities.forEach(apiEntities => {
    const newEntities = apiEntities.map(entity => {
      const existingEntity = mergedEntites[entity.name];
      if (
        !existingEntity ||
        (existingEntity &&
          !existingEntity.endpoints.list &&
          !existingEntity.endpoints.single)
      ) {
        mergedEntites[entity.name] = entity;
      }
    });
  });

  return Object.values(mergedEntites);
}

export default generate;
