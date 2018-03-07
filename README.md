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

      var result = await restClient.get(endpoint.url, parameters);
      if (result.items && Array.isArray(result.items)) return result.items;

      return result;
    },
  },
  paginationStrategy: 'NONE' // this is the default
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

        var result = await restClient.get(endpoint.url, parameters);
        if (result.items && Array.isArray(result.items)) return result.items;

        return result;
      },
      paginationStrategy: 'NONE' // this is the default... can be left out
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

        var result = await restClient.get(endpoint.url, parameters);
        if (result.items && Array.isArray(result.items)) return result.items;

        return result;
      },
      paginationStrategy: 'NONE' // this is the default... can be left out
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

### paginationStrategy
One of the options on schemaFromMultiple, generate is "paginationStrategy". Right now there are two options

1.) 'NONE' (default)
  This will make it so all of your list types will be directly on their field name i.e.
  ```
  blog(id: 1) {
    id
    posts(take: 2, ...other args...) {
      id
      text
    }
  }
  ```

2.) 'SIMPLE'
  This just adds a totalItems under your list items along side a nested "items" list i.e.
  ```
  blog(id: 1) {
    id
    posts(take: 2, ...other args...) {
      totalItems
      items {
        id
        text
      }
    }
  }
  ```

  Please note you will need to set the "totalItems" and "items" field in your apiResolver doing something like:
  ```
  async ({
      parent,
      parentType,
      parameters,
      rawUrl,
      fieldName,
      type,
      context,
    }) => {
      // Come up with a strategy to set the variables on the raw url depending on how your api handles requests
      var endpoint = setRawUrl({
        rawUrl,
        fieldName,
        parameters,
        parentType,
        parent,
      });

      var result = await restClient.get(endpoint.url, parameters);
      if (result.items && Array.isArray(result.items)) {
        return {
          totalItems: result.totalItems,
          items: result.items,
        }
      }

      return result;
    }
  ```
  The "SIMPLE" strategy is super useful when your api response for list requests is wrapped in a object that contains the totalItems

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

  The apollo context
### Things to note

To get a raw graphql schema object (graphqljs) you can call use:
```
import { generateTypes } from 'graphql-schema-from-swagger';

const schema = generateTypes(accountSwaggerJson, { listResultName: ..., apiResolver ... });

```

I've only tested this with [Swashbuckle for AspNetCore](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)
(I have no idea if it will work with other swaggered apis in different languages / versions)

It only supports get requests at the moment

Check out the tests for tinkering with example swagger json files (npm run test:watch)


### TODO
- Optional opt in list of types to expose
