// @flow
import toCamelCase from 'camelcase';

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
  stripNameRegex: RegExp;
  entityWhiteList: ?Array<string>;
  constructor(swaggerJson: Object, options: SwaggerParserOptions) {
    if (typeof swaggerJson !== 'object')
      throw new Error('Expected an object as input');

    if (swaggerJson.swagger === undefined)
      throw new Error('The swagger json is not valid');

    if (!options.apiResolver) throw new Error('apiResolver is required');

    this.apiResolver = options.apiResolver;
    this.stripNameRegex = /[^\w\s]/gi;
    this.entityWhiteList = options.entityWhiteList;
    this.rawSwaggerJson = swaggerJson;
    this.swaggerJson = this.cleanSwaggerFile(swaggerJson);
  }

  getResponseSchemaFromPath(path: string) {
    const currentPath = this.rawSwaggerJson.paths[path];
    if (
      currentPath.get &&
      currentPath.get.responses &&
      currentPath.get.responses['200'] &&
      currentPath.get.responses['200']['schema']
    ) {
      return currentPath.get.responses['200']['schema'];
    }
    return null;
  }

  cleanSwaggerFile(swaggerJson: Object) {
    // clean definitions
    const definitions = Object.keys(swaggerJson.definitions).reduce(
      (acc, key) => {
        acc[this.cleanSchemaDefinition(key)] = {
          ...swaggerJson.definitions[key],
          properties: Object.keys(
            swaggerJson.definitions[key].properties,
          ).reduce((accProp, currentKey) => {
            accProp[currentKey] =
              swaggerJson.definitions[key].properties[currentKey];
            if (
              accProp[currentKey].items &&
              accProp[currentKey].items['$ref']
            ) {
              accProp[currentKey].items['$ref'] = this.cleanSchemaDefinition(
                accProp[currentKey].items['$ref'],
              );
            }
            if (accProp[currentKey]['$ref']) {
              accProp[currentKey]['$ref'] = this.cleanSchemaDefinition(
                accProp[currentKey]['$ref'],
              );
            }
            return accProp;
          }, {}),
        };
        return acc;
      },
      {},
    );

    // clean get paths
    const paths = Object.keys(swaggerJson.paths).reduce((acc, routePath) => {
      acc[routePath] = swaggerJson.paths[routePath];
      const schema = this.getResponseSchemaFromPath(routePath);
      if (schema && schema['$ref']) {
        schema['$ref'] = this.cleanSchemaDefinition(schema['$ref']);
      }

      if (schema && schema['items'] && schema['items']['$ref']) {
        schema['items']['$ref'] = this.cleanSchemaDefinition(
          schema['items']['$ref'],
        );
      }
      return acc;
    }, {});

    return {
      ...swaggerJson,
      definitions,
      paths,
    };
  }

  cleanSchemaDefinition(schemaDefinition: string) {
    return schemaDefinition
      .replace('#/definitions/', '')
      .replace(this.stripNameRegex, '');
  }

  endpointEqualsEntity(endpoint: string, entityName: string) {
    const schema = this.getResponseSchemaFromPath(endpoint);
    return schema && schema['$ref'] && schema['$ref'] === entityName;
  }

  endpointForEntity(entityName: string) {
    let endpointUrl = null;

    Object.keys(this.swaggerJson.paths).map(endpoint => {
      if (this.endpointEqualsEntity(endpoint, entityName)) {
        endpointUrl = endpoint;
      }
    });

    if (endpointUrl === null) return null;

    return {
      url: endpointUrl,
      parameters: this.swaggerJson.paths[endpointUrl].get.parameters,
      operationId: toCamelCase(
        this.swaggerJson.paths[endpointUrl].get.operationId,
      ),
    };
  }

  listEndpointForEntity(rawEntityName: string) {
    let listEndpoint = null;
    Object.keys(this.swaggerJson.paths).map(endpointUrl => {
      const schema = this.getResponseSchemaFromPath(endpointUrl);
      if (
        schema &&
        schema.type === 'array' &&
        schema.items &&
        schema.items['$ref'] === rawEntityName
      ) {
        listEndpoint = {
          url: endpointUrl,
          parameters: this.swaggerJson.paths[endpointUrl].get.parameters,
          listEntityName: null,
        };
      }
    });

    if (listEndpoint) return listEndpoint;

    const parentEntityName = this.parentForEntity(rawEntityName, true);
    if (parentEntityName) {
      const parentProperties = this.swaggerJson.definitions[parentEntityName]
        .properties;
      const parentEntityEndpoint = this.endpointForEntity(parentEntityName);
      Object.keys(parentProperties).map(key => {
        if (
          parentEntityEndpoint &&
          parentProperties[key].type === 'array' &&
          parentProperties[key].items &&
          parentProperties[key].items['$ref'] &&
          parentProperties[key].items['$ref'] === rawEntityName
        ) {
          listEndpoint = {
            ...parentEntityEndpoint,
            listEntityName: parentEntityName,
          };
        }
      });
    }

    return listEndpoint;
  }

  endpointsForEntity(entity: string) {
    let list,
      single = null;

    Object.keys(this.swaggerJson.paths).map(endpoint => {
      if (this.endpointEqualsEntity(endpoint, entity)) {
        single = {
          url: endpoint,
          parameters: this.swaggerJson.paths[endpoint].get.parameters,
        };
      }
    });

    const endpoints = {
      list: this.listEndpointForEntity(entity),
      single,
    };
    if (endpoints.list && endpoints.single) {
      endpoints.isFullEntity = true;
    }
    return endpoints;
  }

  relationshipsForEntity(entity: string) {
    const entityProperties = this.swaggerJson.definitions[entity].properties;
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

  parentsForEntity(entity: string) {
    let parentEntities = [];
    const allDefinitions = this.swaggerJson.definitions;

    Object.keys(allDefinitions).forEach(currentEntity => {
      let currentEntityProperties = allDefinitions[currentEntity].properties;
      Object.keys(currentEntityProperties).forEach(property => {
        if (currentEntityProperties[property]['$ref'] != undefined) {
          const entityName = currentEntityProperties[property]['$ref'];
          if (entityName === entity && this.endpointForEntity(entityName))
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

  parentForEntity(rawEntityName: string, isRootEntity: boolean = false) {
    const entity = this.parentsForEntity(rawEntityName)
      .map(e => {
        let isRoot = false;

        if (this.parentsForEntity(e).length === 0) {
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

  getEntities(): Array<Object> {
    let entities = Object.keys(this.swaggerJson.definitions)
      .filter(val => this.swaggerJson.definitions[val].type === 'object')
      .map(name => ({
        endpoints: this.endpointsForEntity(name),
        apiResolver: this.apiResolver,
        name,
        parentEntityName: this.parentForEntity(name),
        properties: this.swaggerJson.definitions[name].properties,
        relationships: this.relationshipsForEntity(name),
      }));

    const fullEntityListResultNames = entities.reduce((acc, e) => {
      if (e.endpoints.list && e.endpoints.list.listEntityName) {
        acc.push(e.endpoints.list.listEntityName);
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

    const usedEntities = [];
    entities.map(e => {
      if (e.endpoints.single || e.endpoints.list) {
        usedEntities.push(e.name);
      }
      if (e.endpoints.list && e.endpoints.list.listEntityName) {
        usedEntities.push(e.endpoints.list.listEntityName);
      }

      Object.keys(e.relationships).map(key => {
        usedEntities.push(e.relationships[key].name);
      });
    });

    // filter whitelist
    if (this.entityWhiteList) {
      entities = entities
        .filter(
          e => !this.entityWhiteList || this.entityWhiteList.includes(e.name),
        )
        .map(e => {
          const relationships = {};

          Object.keys(e.relationships).reduce((acc, key) => {
            const whiteList = this.entityWhiteList || [];
            if (whiteList.includes(e.relationships[key].name)) {
              acc[key] = e.relationships[key];
            }
            return acc;
          }, relationships);

          const properties = {};
          Object.keys(e.properties).reduce((acc, key) => {
            const whiteList = this.entityWhiteList || [];

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
            const whiteList = this.entityWhiteList || [];
            acc[key] = e.endpoints[key] || null;
            if(key === 'list' && acc[key] && !whiteList.includes(acc[key].listEntityName)) {
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

    // filter out unused entities
    entities = entities.filter(e => usedEntities.includes(e.name));

    return entities;
  }
}
