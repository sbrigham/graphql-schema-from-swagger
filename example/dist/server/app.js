'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _apolloServerExpress = require('apollo-server-express');

var _graphqlTools = require('graphql-tools');

var _graphqlSchemaFromSwagger = require('graphql-schema-from-swagger');

var _petstore = require('../data/petstore.swagger');

var _petstore2 = _interopRequireDefault(_petstore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();
app.disable('x-powered-by');

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

const getRequest = (url, params) => (0, _isomorphicFetch2.default)(`http://petstore.swagger.io/v2${url}?${_qs2.default.stringify(params)}`).then(response => response.json());

function setRawUrl({
  rawUrl,
  fieldName,
  parameters,
  parentType,
  parent
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
    variables
  };
}

app.use((0, _morgan2.default)(function (tokens, req, res) {
  const response = [tokens.method(req, res), tokens.url(req, res), tokens.status(req, res), tokens['response-time'](req, res), 'ms'].join(' ');

  return response;
}));

app.get('/', (0, _apolloServerExpress.graphiqlExpress)({ endpointURL: '/graphql' }));

app.use('/graphql', _bodyParser2.default.json(), (0, _apolloServerExpress.graphqlExpress)(req => {
  const graphQlSchema = (0, _graphqlSchemaFromSwagger.schemaFromMultiple)([{
    swaggerJson: _petstore2.default,
    options: {
      apiResolver: async ({
        parent,
        parentType,
        parameters,
        rawUrl,
        fieldName,
        type
      }) => {
        const result = setRawUrl({
          rawUrl,
          fieldName,
          parameters,
          parentType,
          parent
        });

        console.log({
          'type': type,
          'parent': parent,
          'parentType': parentType,
          'parameters': parameters,
          'rawUrl': rawUrl,
          'fieldName': fieldName
        });

        return await getRequest(result.url, parameters);
      }
    }
  }]);

  const schema = (0, _graphqlTools.makeExecutableSchema)(graphQlSchema);
  return {
    schema,
    context: {}
  };
}));

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
    message: err.message
  });
});

exports.default = app;
//# sourceMappingURL=app.js.map