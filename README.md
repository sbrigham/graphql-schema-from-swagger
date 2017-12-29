# GRAPHQL-SCHEMA-FROM-SWAGGER

Dynamically create your apollo ready graphql schema from one or many swagger enabled apis

## Installation 
```
npm install graphql-schema-from-swagger
```

## Usage

### Single Api
```
import { generate } from 'graphql-schema-from-swagger';

const apolloSchema = generate(accountApiSwaggerJson, {
  // This is a callback function for all the requests made to this api.
  apiResolver: async ({
      parent,
      parentType,
      parameters,
      rawUrl,
      fieldName,
      type,
    }) => {
      // Come up with a strategy to set the variables on the raw url for things like nested urls
      var endpoint = setRawUrl({
        rawUrl,
        fieldName,
        parameters,
        parentType,
        parent,
      });

      var result = await restClient.get(endpoint.url, parameters);
      if (result.items && Array.isArray(result.items)) return result.items;

      return result;
    },
  },
  // This is the defined type in your api from your list endpoints
  listResultName: 'ListResult'
});

/*
  apolloSchema looks like:
  {
    typeDefs: ``, // Your graphql schema as a string,
    resolvers: {}, // The resolvers for your graphql types
  }
*/

```

### Multiple Apis

```
import { schemaFromMultiple } from 'graphql-schema-from-swagger';

const apolloSchema = schemaFromMultiple([
  {
    swaggerJson: accountApiSwaggerJson,
    options: {
      apiResolver: async ({
        parent,
        parentType,
        parameters,
        rawUrl,
        fieldName,
        type,
      }) => {
        // Come up with a strategy to set the variables on the raw url for things like nested urls
        var endpoint = setRawUrl({
          rawUrl,
          fieldName,
          parameters,
          parentType,
          parent,
        });

        var result = await restClient.get(endpoint.url, parameters);
        if (result.items && Array.isArray(result.items)) return result.items;

        return result;
      },
      listResultName: 'ListResult'
    }
  },
  {
    swaggerJson: blogApiSwaggerJson,
    options: {
      apiResolver: async ({
        parent,
        parentType,
        parameters,
        rawUrl,
        fieldName,
        type,
      }) => {
        // Come up with a strategy to set the variables on the raw url for things like nested urls
        var endpoint = setRawUrl({
          rawUrl,
          fieldName,
          parameters,
          parentType,
          parent,
        });

        var result = await restClient.get(endpoint.url, parameters);
        if (result.items && Array.isArray(result.items)) return result.items;

        return result;
      },
      listResultName: 'PagedResult'
    }
  }
]);

/*
  again your apolloSchema will look like:
  {
    typeDefs: ``, // Your graphql schema as a string,
    resolvers: {}, // The resolvers for your graphql types
  }
*/
```

### Things to note

- To get a raw graphql schema object (graphqljs) you can call use:
```
import { generateTypes } from 'graphql-schema-from-swagger';

const schema = generateTypes(accountSwaggerJson, { listResultName: ..., apiResolver ... });

```

- I've only tested this with [Swashbuckle for AspNetCore](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)
(I have no idea if it will work with other swaggered apis in different languages / versions)

- Only supports gets at the moment

Check out the tests for tinkering with example swagger json files (npm run test:watch)


### TODO
- Get a paged result set working for list endpoints
- Optional opt in list of types to expose
