// @flow
import toCamelCase from 'camelcase';

export type SwaggerParserOptions = {
  apiResolver: Function,
};

export type Entity = {
  name: string,
  parentEntityName: string,
  endpoint: Object,
  endpoints: Object,
  properties: Object,
  relationships: Object,
  apiResolver: Function,
};

export default class SwaggerParser {
  swaggerJson: { [string]: Object };
  apiResolver: Function;
  stripNameRegex: RegExp;
  constructor(swaggerJson: Object, options: SwaggerParserOptions) {
    if (typeof swaggerJson !== 'object')
      throw new Error('Expected an object as input');

    if (swaggerJson.swagger === undefined)
      throw new Error('The swagger json is not valid');

    if (!options.apiResolver) throw new Error('apiResolver is required');

    this.swaggerJson = swaggerJson;
    this.apiResolver = options.apiResolver;
    this.stripNameRegex = /[^\w\s]/gi;
  }

  stripEntityName(name: string) {
    return name.replace(this.stripNameRegex, '');
  }

  endpointEqualsEntity(endpoint: string, entityName: string) {
    return (
      this.swaggerJson.paths[endpoint].get &&
      this.swaggerJson.paths[endpoint].get.responses &&
      this.swaggerJson.paths[endpoint].get.responses['200'] &&
      this.swaggerJson.paths[endpoint].get.responses['200'].schema &&
      this.swaggerJson.paths[endpoint].get.responses['200'].schema['$ref'] &&
      this.swaggerJson.paths[endpoint].get.responses['200'].schema[
        '$ref'
      ].replace('#/definitions/', '') === entityName
    );
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
      operationId: toCamelCase(this.swaggerJson.paths[endpointUrl].get.operationId)
    };
  }

  listEndpointForEntity(rawEntityName: string) {
    let listEndpoint = null;
    Object.keys(this.swaggerJson.paths).map(endpointUrl => {
      if(
        this.swaggerJson.paths[endpointUrl].get &&
        !this.swaggerJson.paths[endpointUrl].get.deprecated &&
        this.swaggerJson.paths[endpointUrl].get.responses &&
        this.swaggerJson.paths[endpointUrl].get.responses["200"] &&
        this.swaggerJson.paths[endpointUrl].get.responses["200"].schema &&
        this.swaggerJson.paths[endpointUrl].get.responses["200"].schema.type === 'array' &&
        this.swaggerJson.paths[endpointUrl].get.responses["200"].schema.items &&
        this.swaggerJson.paths[endpointUrl].get.responses["200"].schema.items[
          '$ref'
        ].replace('#/definitions/', '') == rawEntityName
      ) {
        listEndpoint = {
          url: endpointUrl,
          parameters: this.swaggerJson.paths[endpointUrl].get.parameters,
          listEntityName: null,
        };
      }
    });

    if(listEndpoint) return listEndpoint;

    const parentEntityName = this.parentForEntity(rawEntityName, true);
    if (parentEntityName) {
      const parentProperties = this.swaggerJson.definitions[parentEntityName].properties;
      const parentEntityEndpoint = this.endpointForEntity(parentEntityName);
      Object.keys(parentProperties).map(key => {
        if(
          parentEntityEndpoint &&
          parentProperties[key].type === 'array' &&
          parentProperties[key].items &&
          parentProperties[key].items['$ref'] &&
          parentProperties[key].items['$ref'].replace('#/definitions/', '') == rawEntityName
        ) {
          listEndpoint = {
            ...parentEntityEndpoint,
            listEntityName: this.stripEntityName(parentEntityName),
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
      if(endpoints.list && endpoints.single) {
        endpoints.isFullEntity = true;
      }
      return endpoints;
  }

  relationshipsForEntity(entity: string) {
    const entityProperties = this.swaggerJson.definitions[entity].properties;
    const relationships = {};

    Object.keys(entityProperties).forEach(property => {
      if (entityProperties[property]['$ref'] != undefined) {
        const entityName = entityProperties[property]['$ref'].replace(
          '#/definitions/',
          ''
        );
        relationships[property] = { name: this.stripEntityName(entityName), isList: false };
      } else if (
        entityProperties[property].type === 'array' &&
        entityProperties[property].items &&
        entityProperties[property].items['$ref']
      ) {
        const entityName = entityProperties[property].items['$ref'].replace(
          '#/definitions/',
          ''
        );
        relationships[property] = { name: this.stripEntityName(entityName), isList: true };
      }
    });

    return relationships;
  }

  parentsForEntity(entity: string) {
    let parentEntities = [];
    const allDefinitions = this.swaggerJson.definitions;

    Object.keys(allDefinitions)
      .forEach(currentEntity => {
        let currentEntityProperties = allDefinitions[currentEntity].properties;
        Object.keys(currentEntityProperties).forEach(property => {
          if (currentEntityProperties[property]['$ref'] != undefined) {
            const entityName = currentEntityProperties[property][
              '$ref'
            ].replace('#/definitions/', '');
            if (entityName === entity && this.endpointForEntity(entityName))
              parentEntities.push(currentEntity);
          } else if (
            currentEntityProperties[property].type === 'array' &&
            currentEntityProperties[property].items &&
            currentEntityProperties[property].items['$ref']
          ) {
            const entityName = currentEntityProperties[property].items[
              '$ref'
            ].replace('#/definitions/', '');
            if(entityName === entity) {
              parentEntities.push(currentEntity);
            }
          }
        });
      });

    return parentEntities;
  }

  parentForEntity(rawEntityName: string, isRootEntity: boolean = false) {
    const entity = this.parentsForEntity(rawEntityName).map(e => {
      let isRoot = false;

      if(this.parentsForEntity(e).length === 0) {
        isRoot = true;
      }

      return {
        isRoot,
        name: e
      }
    }).find(e => e.isRoot === isRootEntity);

    return entity ? entity.name : null;
  }

  getEntities(): Array<Object> {
    let entities = Object.keys(this.swaggerJson.definitions)
      .filter(val => this.swaggerJson.definitions[val].type === 'object')
      .map(name => ({
        endpoints: this.endpointsForEntity(name),
        apiResolver: this.apiResolver,
        name: this.stripEntityName(name),
        parentEntityName: this.parentForEntity(name),
        properties: this.swaggerJson.definitions[name].properties,
        relationships: this.relationshipsForEntity(name),
      }));

    const fullEntityListResultNames = entities.reduce((acc, e) => {
      if(e.endpoints.list && e.endpoints.list.listEntityName) {
        acc.push(e.endpoints.list.listEntityName);
      }
      return acc;
    }, []);

    // Remove endpoints if the endpoint already exists in a full entity
    entities = entities.map(e => {
      if((e.endpoints.single || e.endpoints.list) && fullEntityListResultNames.includes(e.name)) {
        return {
          ...e,
          endpoints: {},
          relationships: {},
        }
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

    return entities.filter(e => usedEntities.includes(e.name));
  }
}
