# GRAPHQL-SCHEMA-FROM-SWAGGER

Dynamically create your apollo ready graphql schema from one or many swagger enabled apis

## Installation

```bash
npm install graphql-schema-from-swagger
```

## Usage

### Single Api Example

```javascript
import { generate } from 'graphql-schema-from-swagger';

const apolloSchema = generate(accountApiSwaggerJson, {
  // This is a callback function for all the get requests made to this api.
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

      // fetch data using your favorite http client
      return await restClient.get(endpoint.url, parameters);
    },
  }
});

/*
  apolloSchema looks like:
  {
    typeDefs: ``, // Your graphql schema as a string,
    resolvers: {}, // The resolvers for your graphql types
  }
*/

```

### Multiple Api Example

```javascript
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
        context,
      }) => {
        // Come up with a strategy to set the variables on the raw url for things like nested urls
        var endpoint = setRawUrl({
          rawUrl,
          fieldName,
          parameters,
          parentType,
          parent,
        });

        // fetch data using your favorite http client
        return await restClient.get(endpoint.url, parameters);
      }
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
        context,
      }) => {
        // Come up with a strategy to set the variables on the raw url for things like nested urls
        var endpoint = setRawUrl({
          rawUrl,
          fieldName,
          parameters,
          parentType,
          parent,
        });

        // fetch data using your favorite http client
        return await restClient.get(endpoint.url, parameters);
      }
    }
  }
]);
```

### apiResolver

This is where all the resolvers for you get requests funnel through.

As part of the callback you are given relevant information to help set variables on the raw url:

```parent```

  A hydrated parent object think blog when dealing with posts

```parentType```

  "Blog" when dealing with posts

```parameters```

  An object from what's sent from the client i.e. { take: 2, blogId: 1 }

```rawUrl```

  The url as defined by your swagger endpoint (it's up to you to set the variables in the curly braces)

```fieldName```

  i.e. "posts" or "blog"

```type```

  i.e "Post", "Comment", "Account"

```context```
  The apollo context object

### Things to note

To get a raw GraphQl Schema Object (graphqljs) you can call use:

```javascript

import { generateTypes } from 'graphql-schema-from-swagger';

const schema = generateTypes(accountSwaggerJson, { apiResolver });

```



- Only supports "GET" requests at the moment

Check out the tests for tinkering with example swagger json files (npm run test:watch)

