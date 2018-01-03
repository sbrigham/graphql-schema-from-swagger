// @flow

export type PaginationStrategy = "NONE" | "SIMPLE";

export type SwaggerParserOptions = {
  apiResolver: Function,
  listResultName: string,
  paginationStrategy?: PaginationStrategy,
};

export type Entity = {
  name: string,
  parentEntityName: string,
  paginationStrategy: PaginationStrategy,
  endpoints: Object,
  properties: Object,
  relationships: Object,
  mainResolver: Function,
};

export default class SwaggerParser {
  swaggerJson: Object;
  listResultName: string;
  paginationStrategy: PaginationStrategy;
  listItemRegex: Object;
  mainResolver: Function;
  constructor(swaggerJson: Object, options: SwaggerParserOptions) {
    if (typeof swaggerJson !== 'object')
      throw new Error('Expected an object as input');

    if (swaggerJson.swagger === undefined)
      throw new Error('The swagger json is not valid');

    if (!options.listResultName) throw new Error('listResultName is required');

    if (!options.apiResolver) throw new Error('apiResolver is required');

    if (options.paginationStrategy && (options.paginationStrategy !== 'NONE' && options.paginationStrategy !== 'SIMPLE'))
      throw new Error(`The pagination strategy: ${options.paginationStrategy} does not exist`);

    this.paginationStrategy = options.paginationStrategy || 'NONE';
    this.swaggerJson = swaggerJson;
    this.listResultName = options.listResultName;
    this.listItemRegex = new RegExp(
      `[${this.listResultName}]\\[([a-zA-Z]+)\\]$`
    );
    this.mainResolver = options.apiResolver;
  }

  getListEndpointEntity(name: string) {
    const listEndpointName = Object.keys(this.swaggerJson.definitions).find(
      val => this.listItemRegex.test(val) && val.includes(name)
    );
    return listEndpointName;
  }

  endpointEqualsEntity(endpoint: string, entity: string) {
    return (
      this.swaggerJson.paths[endpoint].get &&
      this.swaggerJson.paths[endpoint].get.responses &&
      this.swaggerJson.paths[endpoint].get.responses['200'] &&
      this.swaggerJson.paths[endpoint].get.responses['200'].schema &&
      this.swaggerJson.paths[endpoint].get.responses['200'].schema['$ref'] &&
      this.swaggerJson.paths[endpoint].get.responses['200'].schema[
        '$ref'
      ].replace('#/definitions/', '') === entity
    );
  }

  endpointForEntity(entity: string) {
    let endpointUrl = null;

    Object.keys(this.swaggerJson.paths).map(endpoint => {
      if (this.endpointEqualsEntity(endpoint, entity)) {
        endpointUrl = endpoint;
      }
    });

    if (endpointUrl === null) return null;

    return {
      url: endpointUrl,
      parameters: this.swaggerJson.paths[endpointUrl].get.parameters,
    };
  }

  getListResultName(entityName: string) {
    return `${this.listResultName}[${entityName}]`;
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

      if (this.endpointEqualsEntity(endpoint, this.getListResultName(entity))) {
        list = {
          url: endpoint,
          parameters: this.swaggerJson.paths[endpoint].get.parameters,
        };
      }
    });

    return {
      list,
      single,
    };
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
        relationships[property] = { name: entityName, isList: false };
      } else if (
        entityProperties[property].type === 'array' &&
        entityProperties[property].items &&
        entityProperties[property].items['$ref']
      ) {
        const entityName = entityProperties[property].items['$ref'].replace(
          '#/definitions/',
          ''
        );
        relationships[property] = { name: entityName, isList: true };
      }
    });

    return relationships;
  }

  parentForEntity(entity: string) {
    let parentEntityName = null;
    const allEntities = this.swaggerJson.definitions;
    Object.keys(allEntities)
      .filter(val => !this.listItemRegex.test(val))
      .forEach(currentEntity => {
        let currentEntityProperties = allEntities[currentEntity].properties;
        Object.keys(currentEntityProperties).forEach(property => {
          if (currentEntityProperties[property]['$ref'] != undefined) {
            const entityName = currentEntityProperties[property][
              '$ref'
            ].replace('#/definitions/', '');
            if (entityName === entity && this.endpointForEntity(entityName))
              parentEntityName = currentEntity;
          } else if (
            currentEntityProperties[property].type === 'array' &&
            currentEntityProperties[property].items &&
            currentEntityProperties[property].items['$ref']
          ) {
            const entityName = currentEntityProperties[property].items[
              '$ref'
            ].replace('#/definitions/', '');
            const listEndpointName = this.getListEndpointEntity(entityName);
            if (
              `${this.listResultName}[${entity}]` === listEndpointName &&
              this.endpointForEntity(entityName)
            ) {
              parentEntityName = currentEntity;
            }
          }
        });
      });
    return parentEntityName;
  }

  getEntities(): Array<Object> {
    const entities = Object.keys(this.swaggerJson.definitions)
      .filter(val => this.swaggerJson.definitions[val].type === 'object')
      .filter(name => !this.listItemRegex.test(name))
      .map(name => ({
        paginationStrategy: this.paginationStrategy,
        endpoints: this.endpointsForEntity(name),
        mainResolver: this.mainResolver,
        name,
        parentEntityName: this.parentForEntity(name),
        properties: this.swaggerJson.definitions[name].properties,
        relationships: this.relationshipsForEntity(name),
      }));

    return entities;
  }
}
