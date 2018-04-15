// @flow
import { getResponseSchemaFromPath } from './utils';

function clean(rawSwaggerJson: Object): Object {
  // clean definitions
  const definitions = Object.keys(rawSwaggerJson.definitions).reduce(
    (acc, key) => {
      acc[cleanSchemaDefinition(key)] = {
        ...rawSwaggerJson.definitions[key],
        properties: Object.keys(rawSwaggerJson.definitions[key].properties).reduce(
          (accProp, currentKey) => {
            accProp[currentKey] =
              rawSwaggerJson.definitions[key].properties[currentKey];
            if (
              accProp[currentKey].items &&
              accProp[currentKey].items['$ref']
            ) {
              accProp[currentKey].items['$ref'] = cleanSchemaDefinition(
                accProp[currentKey].items['$ref'],
              );
            }
            if (accProp[currentKey]['$ref']) {
              accProp[currentKey]['$ref'] = cleanSchemaDefinition(
                accProp[currentKey]['$ref'],
              );
            }
            return accProp;
          },
          {},
        ),
      };
      return acc;
    },
    {},
  );

  // clean get paths
  const paths = Object.keys(rawSwaggerJson.paths).reduce((acc, routePath) => {
    acc[routePath] = rawSwaggerJson.paths[routePath];
    const schema = getResponseSchemaFromPath(rawSwaggerJson, routePath);
    if (schema && schema['$ref']) {
      schema['$ref'] = cleanSchemaDefinition(schema['$ref']);
    }

    if (schema && schema['items'] && schema['items']['$ref']) {
      schema['items']['$ref'] = cleanSchemaDefinition(
        schema['items']['$ref'],
      );
    }
    return acc;
  }, {});

  return {
    ...rawSwaggerJson,
    definitions,
    paths,
  };
}

function cleanSchemaDefinition(schemaDefinition: string) {
  return schemaDefinition
    .replace('#/definitions/', '')
    .replace(/[^\w\s]/gi, '');
}

export default clean;
