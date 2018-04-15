import { endpointForEntity } from './endpoints';

export function parentsForEntity(swaggerJson: Object, entity: string) {
  let parentEntities = [];
  const allDefinitions = swaggerJson.definitions;

  Object.keys(allDefinitions).forEach(currentEntity => {
    let currentEntityProperties = allDefinitions[currentEntity].properties;
    Object.keys(currentEntityProperties).forEach(property => {
      if (currentEntityProperties[property]['$ref'] != undefined) {
        const entityName = currentEntityProperties[property]['$ref'];
        if (entityName === entity && endpointForEntity(swaggerJson, entityName))
          parentEntities.push(currentEntity);
      } else if (
        currentEntityProperties[property].type === 'array' &&
        currentEntityProperties[property].items &&
        currentEntityProperties[property].items['$ref']
      ) {
        const entityName = currentEntityProperties[property].items['$ref'];
        if (entityName === entity) {
          parentEntities.push(currentEntity);
        }
      }
    });
  });

  return parentEntities;
}

function parentForEntity(swaggerJson: Object, rawEntityName: string, isRootEntity: boolean = false) {
  const entity = parentsForEntity(swaggerJson, rawEntityName)
    .map(e => {
      let isRoot = false;

      if (parentsForEntity(swaggerJson, e).length === 0) {
        isRoot = true;
      }

      return {
        isRoot,
        name: e,
      };
    })
    .find(e => e.isRoot === isRootEntity);

  return entity ? entity.name : null;
}

export default parentForEntity;
