// @flow
import { type Entity } from '../swagger-parser';

function fitlerWhitelist(entityWhiteList: Array<string>, entities: Array<Entity>): Array<Entity> {
  return entities
    .filter(e => !entityWhiteList || entityWhiteList.includes(e.name))
    .map(e => {
      const relationships = {};

      Object.keys(e.relationships).reduce((acc, key) => {
        const whiteList = entityWhiteList || [];
        if (whiteList.includes(e.relationships[key].name)) {
          acc[key] = e.relationships[key];
        }
        return acc;
      }, relationships);

      const properties = {};
      Object.keys(e.properties).reduce((acc, key) => {
        const whiteList = entityWhiteList || [];

        if (
          e.properties[key]['$ref'] &&
          !whiteList.includes(e.properties[key]['$ref'])
        ) {
          return acc;
        }
        if (
          e.properties[key].type === 'array' &&
          e.properties[key].items &&
          e.properties[key].items['$ref'] &&
          !whiteList.includes(e.properties[key].items['$ref'])
        ) {
          return acc;
        }

        acc[key] = e.properties[key];
        return acc;
      }, properties);

      const endpoints = {};
      Object.keys(e.endpoints).reduce((acc, key) => {
        const whiteList = entityWhiteList || [];
        acc[key] = e.endpoints[key] || null;
        if (
          key === 'list' &&
          acc[key] &&
          !whiteList.includes(acc[key].listEntityName)
        ) {
          acc[key] = null;
        }
        return acc;
      }, endpoints);

      return {
        ...e,
        endpoints,
        relationships,
        properties,
      };
    });
}

export default fitlerWhitelist;
