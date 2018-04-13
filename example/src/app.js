import express from 'express';
import http from 'http';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';
import qs from 'qs';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import {
  addErrorLoggingToSchema,
  makeExecutableSchema,
  mergeSchemas,
} from 'graphql-tools';
import { schemaFromMultiple } from 'graphql-schema-from-swagger';
import petStoreJson from '../data/petstore.swagger';

const app = express();
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const getRequest = (url, params) => fetch(`http://petstore.swagger.io/v2${url}?${qs.stringify(params)}`).then(response => response.json());

function setRawUrl({
  rawUrl,
  fieldName,
  parameters,
  parentType,
  parent,
}) {
  var variables = {};

  // Try to set all properties on the parent entity
  var url = rawUrl;
  if (parent) {
    Object.keys(parent).forEach(propKey => {
      if (rawUrl.includes(`{${propKey}}`) && propKey !== 'id') {
        variables[propKey] = parent[propKey];
        url = url.replace(`{${propKey}}`, parent[propKey]);
      }
    });
  }

  // has one relationship the entity name exists on the parent entity
  if (parent && parent[`${fieldName}Id`]) {
    variables['id'] = parent[`${fieldName}Id`];
    url = url.replace('{id}', parent[`${fieldName}Id`]);
  }

  // Try to set the parentName + Id
  if (parent && parent.id) {
    variables[`${parentType.toLowerCase()}Id`] = parent.id;
    url = url.replace(`{${parentType.toLowerCase()}Id}`, parent.id);
  }

  // Try to set from parameters
  Object.keys(parameters).forEach(propKey => {
    if (rawUrl.includes(`{${propKey}}`)) {
      variables[propKey] = parameters[propKey];
      url = url.replace(`{${propKey}}`, parameters[propKey]);
    }
  });
  if (url.includes('{') || url.includes('}')) {
    throw new Error(`Could not set all variables on url: ${rawUrl}`);
  }

  return {
    url,
    variables,
  };
}

app.use(
  logger(function (tokens, req, res) {
    const response = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens['response-time'](req, res), 'ms'
    ].join(' ');

    return response;
  })
);

app.get('/', graphiqlExpress({ endpointURL: '/graphql' }));

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => {
    const graphQlSchema = schemaFromMultiple([
      {
        swaggerJson: petStoreJson,
        options: {
          apiResolver: async ({
            parent,
            parentType,
            parameters,
            rawUrl,
            fieldName,
            type,
          }) => {
            const result = setRawUrl({
              rawUrl,
              fieldName,
              parameters,
              parentType,
              parent,
            });

            console.log({
              'type': type,
              'parent': parent,
              'parentType': parentType,
              'parameters': parameters,
              'rawUrl': rawUrl,
              'fieldName': fieldName,
            });

            return await getRequest(result.url, parameters);
          }
        },
      }
    ]);

    const schema = makeExecutableSchema(graphQlSchema);
    return {
      schema,
      context: {},
    };
  })
);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res) => {
  // eslint-disable-line no-unused-vars
  res.status(err.status || 500).render('error', {
    message: err.message,
  });
});

export default app;
