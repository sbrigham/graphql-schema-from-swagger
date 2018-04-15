// @flow
import toCamelCase from 'camelcase';
import { getResponseSchemaFromPath } from './utils';
import parentForEntity from './parents';

function endpointsForEntity(swaggerJson: Object, entity: string) {
  let list,
    single = null;

  Object.keys(swaggerJson.paths).map(endpoint => {
    if (endpointEqualsEntity(swaggerJson, endpoint, entity)) {
      single = {
        url: endpoint,
        parameters: swaggerJson.paths[endpoint].get.parameters,
      };
    }
  });

  const endpoints = {
    list: listEndpointForEntity(swaggerJson, entity),
    single,
  };
  if (endpoints.list && endpoints.single) {
    endpoints.isFullEntity = true;
  }
  return endpoints;
}

function endpointEqualsEntity(swaggerJson: Object, endpoint: string, entityName: string) {
  const schema = getResponseSchemaFromPath(swaggerJson, endpoint);
  return schema && schema['$ref'] && schema['$ref'] === entityName;
}

function listEndpointForEntity(swaggerJson: Object, rawEntityName: string) {
  let listEndpoint = null;
  Object.keys(swaggerJson.paths).map(endpointUrl => {
    const schema = getResponseSchemaFromPath(swaggerJson, endpointUrl);
    if (
      schema &&
      schema.type === 'array' &&
      schema.items &&
      schema.items['$ref'] === rawEntityName
    ) {
      listEndpoint = {
        url: endpointUrl,
        parameters: swaggerJson.paths[endpointUrl].get.parameters,
        listEntityName: null,
      };
    }
  });

  if (listEndpoint) return listEndpoint;

  const parentEntityName = parentForEntity(swaggerJson, rawEntityName, true);

  if (parentEntityName) {
    const parentProperties = swaggerJson.definitions[parentEntityName]
      .properties;

    const parentEntityEndpoints = endpointsForEntity(swaggerJson, parentEntityName);
    if(parentEntityEndpoints.isFullEntity) {
      return null;
    }

    Object.keys(parentProperties).map(key => {
      if (
        parentEntityEndpoints.single &&
        parentProperties[key].type === 'array' &&
        parentProperties[key].items &&
        parentProperties[key].items['$ref'] &&
        parentProperties[key].items['$ref'] === rawEntityName
      ) {
        listEndpoint = {
          ...parentEntityEndpoints.single,
          listEntityName: parentEntityName,
        };
      }
    });
  }

  return listEndpoint;
}

export function endpointForEntity(swaggerJson:Object, entityName: string) {
  let endpointUrl = null;

  Object.keys(swaggerJson.paths).map(endpoint => {
    if (endpointEqualsEntity(swaggerJson, endpoint, entityName)) {
      endpointUrl = endpoint;
    }
  });

  if (endpointUrl === null) return null;

  return {
    url: endpointUrl,
    parameters: swaggerJson.paths[endpointUrl].get.parameters,
    operationId: toCamelCase(
      swaggerJson.paths[endpointUrl].get.operationId,
    ),
  };
}

export default endpointsForEntity;
