// @flow
import toCamelCase from 'camelcase';
import resovlerRelationships from './resolver-relationships';
import endpoints from './endpoints';
import parent from './parents';
import filterWhitelist from './filter-whitelist';
import clean from './clean';

type EntityWhiteList = Array<string>;

export type RootSwaggerParserOptions = {
  entityWhiteList?: EntityWhiteList,
  apiResolver?: Function,
};

export type SwaggerParserOptions = {
  apiResolver: Function,
  entityWhiteList?: EntityWhiteList,
};

export type Entity = {
  name: string,
  parentEntityName: string,
  endpoints: Object,
  properties: Object,
  relationships: Object,
  apiResolver: Function,
};

export default class SwaggerParser {
  swaggerJson: { [string]: Object };
  rawSwaggerJson: { [string]: Object };
  apiResolver: Function;
  entityWhiteList: ?Array<string>;
  constructor(swaggerJson: Object, options: SwaggerParserOptions) {
    if (typeof swaggerJson !== 'object')
      throw new Error('Expected an object as input');

    if (swaggerJson.swagger === undefined)
      throw new Error('The swagger json is not valid');

    if (!options.apiResolver) throw new Error('apiResolver is required');

    this.apiResolver = options.apiResolver;
    this.entityWhiteList = options.entityWhiteList;
    this.rawSwaggerJson = swaggerJson;
    this.swaggerJson = clean(swaggerJson);
  }

  getEntities(): Array<Object> {
    let entities = Object.keys(this.swaggerJson.definitions)
      .filter(val => this.swaggerJson.definitions[val].type === 'object')
      .map(name => ({
        endpoints: endpoints(this.swaggerJson, name),
        apiResolver: this.apiResolver,
        name,
        parentEntityName: parent(this.swaggerJson, name),
        properties: this.swaggerJson.definitions[name].properties,
        relationships: resovlerRelationships(this.swaggerJson, name),
      }));

    const fullEntityListResultNames = entities.reduce((acc, e) => {
      if (e.endpoints.list && e.endpoints.list.listEntityName) {
        const listEntityName = e.endpoints.list.listEntityName;
        const listEntity = entities.find(e => e.name === listEntityName);
        if(listEntity && listEntity.endpoints && listEntity.endpoints.list && listEntity.endpoints.isFullEntity) {
          return acc;
        }
        acc.push(listEntityName);
      }
      return acc;
    }, []);

    // Remove endpoints if the endpoint already exists in a full entity
    entities = entities.map(e => {
      if (
        (e.endpoints.single || e.endpoints.list) &&
        fullEntityListResultNames.includes(e.name)
      ) {
        return {
          ...e,
          endpoints: {},
          relationships: {},
        };
      }
      return e;
    });

    if (this.entityWhiteList) {
      entities = filterWhitelist(this.entityWhiteList, entities);
    }
    return entities;
  }
}
