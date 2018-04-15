// @flow
export default function(swaggerJson: Object, entity: string) {
  const entityProperties = swaggerJson.definitions[entity].properties;
  const relationships = {};

  Object.keys(entityProperties).forEach(property => {
    if (entityProperties[property]['$ref'] != undefined) {
      const entityName = entityProperties[property]['$ref'];
      relationships[property] = {
        name: entityName,
        isList: false,
      };
    } else if (
      entityProperties[property].type === 'array' &&
      entityProperties[property].items &&
      entityProperties[property].items['$ref']
    ) {
      const entityName = entityProperties[property].items['$ref'];
      relationships[property] = {
        name: entityName,
        isList: true,
      };
    }
  });

  return relationships;
}


