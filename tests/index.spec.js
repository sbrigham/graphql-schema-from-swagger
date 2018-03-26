// @flow

import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
  printSchema
} from 'graphql';
import {
  generate,
  generateResolvers,
  generateTypes,
  schemaFromMultiple,
} from '../src/index';
import SwaggerParser from '../src/utils/swagger-parser';
import blogSwaggerJson from './example/data/api-blog.swagger';
import accountSwaggerJson from './example/data/api-account.swagger';
import noOrphanedTypes from './example/data/special-cases/should_not_include_orphaned_types';
import listResultDirectlyOnEndpoint from './example/data/special-cases/should_handle_list_results_directly_on_endpoint';
import onlyListEndpointJson from './example/data/special-cases/should_handle_having_only_a_list_endpoint_for_an_entity';
import enumsFromParams from './example/data/special-cases/should_handle_creating_enums_from_parameters';

declare var describe: any;
declare var it: any;
declare var expect: any;
declare var jest: any;

describe('Integration Tests', () => {
  describe('generate', () => {
    it('Has resolvers and typeDefs', () => {
      var result = generate(blogSwaggerJson, {
        apiResolver: () => {},
      });
      expect(result).toHaveProperty('resolvers');
      expect(result).toHaveProperty('typeDefs');
      expect(typeof result.typeDefs).toBe('string');
      expect(typeof result.resolvers).toBe('object');
    });
  });

  describe('generateResolvers', () => {
    it('Has a root query', () => {
      var resolvers = generateResolvers(blogSwaggerJson, {
        apiResolver: () => {},
      });
      expect(resolvers).toHaveProperty('Query');
      expect(typeof resolvers.Query).toBe('object');

      expect(typeof resolvers.Query.blog).toBe('function');
      expect(typeof resolvers.Query.blogs).toBe('function');
      expect(typeof resolvers.Query.post).toBe('function');
      expect(typeof resolvers.Query.posts).toBe('function');
      expect(typeof resolvers.Query.comment).toBe('function');
      expect(typeof resolvers.Query.comments).toBe('function');
    });

    it('Has resolvers for each type', () => {
      var resolvers = generateResolvers(blogSwaggerJson, {
        apiResolver: () => {},
      });
      expect(typeof resolvers.Comment).toBe('object');
      expect(typeof resolvers.Post.comments).toBe('function');
      expect(typeof resolvers.Blog.posts).toBe('function');
    });
  });

  describe('generateTypes', () => {
    it('Works with Objects', () => {
      var types = generateTypes(accountSwaggerJson, {
        apiResolver: () => {},
      });

      const result = types.getType('SocialMedia');
      expect(typeof result).toBe('object');
      const objectFields = result.getFields();
      expect(typeof objectFields.facebookUrl).toBe('object');
      expect(typeof objectFields.instagramUrl).toBe('object');
    });

    it('Should return a GraphqlSchema', () => {
      expect(
        typeof generateTypes(blogSwaggerJson, {
          apiResolver: () => {},
        })
      ).toBe('object');
      expect(
        generateTypes(blogSwaggerJson, {
          apiResolver: () => {},
        }).constructor.name
      ).toBe('GraphQLSchema');
    });

    it('Should generate a root query type', () => {
      const queryTypeFields = generateTypes(blogSwaggerJson, {
        apiResolver: () => {},
      })
      .getQueryType()
      .getFields();

      expect(typeof queryTypeFields.blog).toBe('object');
      expect(typeof queryTypeFields.blog).toBe('object');
      expect(typeof queryTypeFields.post).toBe('object');
      expect(typeof queryTypeFields.posts).toBe('object');
      expect(typeof queryTypeFields.comment).toBe('object');
      expect(typeof queryTypeFields.comments).toBe('object');
    });

    it('Should generate a root query type with arguments', () => {
      const queryTypeFields = generateTypes(blogSwaggerJson, {
        apiResolver: () => {},
      })
      .getQueryType()
      .getFields();

      const commentsArguments = queryTypeFields.comments.args;
      expect(commentsArguments.find(a => a.name === 'blogId').type).toEqual(
        new GraphQLNonNull(GraphQLInt)
      );
      expect(commentsArguments.find(a => a.name === 'postId').type).toEqual(
        new GraphQLNonNull(GraphQLInt)
      );
    });

    it('Should generate types', () => {
      const blogType = generateTypes(blogSwaggerJson, {
        apiResolver: () => {},
      })
      .getType('Blog')
      .getFields();

      expect(typeof blogType.id).toBe('object');
      expect(typeof blogType.name).toBe('object');
      expect(typeof blogType.createdOn).toBe('object');
      expect(typeof blogType.updatedOn).toBe('object');
      expect(typeof blogType.createdBy).toBe('object');
      expect(typeof blogType.postCount).toBe('object');
      expect(typeof blogType.posts).toBe('object');
      expect(blogType.posts.type.toString()).toBe('ListResultPost')
      expect(typeof blogType.deleted).toBe('object');
    });

    it('Sets array properties on sub objects', () => {
      const postListType = generateTypes(blogSwaggerJson, {
        apiResolver: () => {},
      })
      .getType('ListResultPost')
      .getFields();

      expect(postListType.items).not.toBeNull();
      expect(postListType.totalItems).not.toBeNull();
      expect(postListType.items.type.toString()).toBe('[Post]')
    });

    it(`Should work for the root query when list results directly on endpoint`, () => {
      const queryTypeFields = generateTypes(listResultDirectlyOnEndpoint, {
        apiResolver: () => {},
      })
      .getQueryType()
      .getFields();

      expect(typeof queryTypeFields.account).toBe('object');
      expect(typeof queryTypeFields.accounts).toBe('object');
      expect(queryTypeFields.accounts.type.toString()).toBe('[Account]')
      expect(queryTypeFields.accounts.args.length).toBe(2);
      expect(queryTypeFields.accounts.args.some(a => a.name === 'take')).toBe(true);
      expect(queryTypeFields.accounts.args.some(a => a.name === 'accountIds')).toBe(true);
    });

    it('Should generate types with arguments', () => {
      const blogType = generateTypes(blogSwaggerJson, {
        apiResolver: () => {},
      })
      .getType('Blog')
      .getFields();

      expect(blogType.posts.args.some(a => a.name === 'blogId')).toBe(true);
      expect(blogType.posts.args.some(a => a.name === 'sinceId')).toBe(true);
      expect(blogType.posts.args.some(a => a.name === 'maxId')).toBe(true);
      expect(blogType.posts.args.some(a => a.name === 'count')).toBe(true);
    });

    it('Should not have any required arguments on type queries', () => {
      const blogType = generateTypes(blogSwaggerJson, {
        apiResolver: () => {},
      })
      .getType('Blog')
      .getFields();

      const postArguments = blogType.posts.args;
      expect(postArguments.find(a => a.name === 'blogId').type).toBe(
        GraphQLInt
      );
    });

    it('Should reference list types in relationships', () => {
      const blogType = generateTypes(blogSwaggerJson, {
        apiResolver: () => {},
      })
      .getType('Blog')
      .getFields();

      const postArguments = blogType.posts.args;
      expect(postArguments.find(a => a.name === 'blogId').type).toBe(
        GraphQLInt
      );
    });

    it('Should handle creating enums from parameters', () => {
      var types = generateTypes(enumsFromParams, {
        apiResolver: () => {},
      });

      const status = types.getType('Status');
      expect(typeof status).toBe('object');

      const visibilities = types.getType('Visibilities');
      expect(typeof visibilities).toBe('object');
    });
  });

  describe('schemaFromMultiple', () => {
    it('Should have resolvers and typeDefs', () => {
      var result = schemaFromMultiple([
        {
          swaggerJson: blogSwaggerJson,
          options: {
            apiResolver: () => {},
          },
        },
        {
          swaggerJson: accountSwaggerJson,
          options: {
            apiResolver: () => {},
          },
        },
      ]);

      expect(result).toHaveProperty('resolvers');
      expect(result).toHaveProperty('typeDefs');
    });

    it('Should have resolvers cross schema', () => {
      var result = schemaFromMultiple([
        {
          swaggerJson: blogSwaggerJson,
          options: {
            apiResolver: () => {},
          },
        },
        {
          swaggerJson: accountSwaggerJson,
          options: {
            apiResolver: () => {},
          },
        },
      ]);

      const resolvers = result.resolvers;
      // $FlowFixMe
      expect(resolvers.Post).toHaveProperty('createdBy');
      // $FlowFixMe
      expect(typeof resolvers.Post.createdBy).toBe('function');
      // $FlowFixMe
      expect(typeof resolvers.Account).toBe('object');
      // $FlowFixMe
      expect(typeof resolvers.Query.account).toBe('function');
    });
  });
});


describe('Unit Tests', () => {
  describe('Swagger Parser', () => {
    it('Requires a swaggerJson file, and options', () => {
      // $FlowFixMe
      expect(() => new SwaggerParser()).toThrow();
      expect(
        () =>
          new SwaggerParser(blogSwaggerJson, {
            apiResolver: () => {},
          })
      ).not.toThrow();
    });

    describe('generateEntities', () => {
      it('Has has the list and single endpoints for an entity', () => {
        var apiResolver = () => {};
        const parser = new SwaggerParser(blogSwaggerJson, { apiResolver });
        const entities = parser.getEntities();
        const blogEntity = entities.find(e => e.name === 'Blog') || {};
        const postEntity = entities.find(e => e.name === 'Post') || {};
        const commentEntity = entities.find(e => e.name === 'Comment') || {};

        expect(typeof blogEntity.endpoints.single).toBe('object');
        expect(blogEntity.endpoints.single).not.toBeNull();
        expect(blogEntity.endpoints.single.url).toBe('/blog/{id}');
        expect(typeof blogEntity.endpoints.list).toBe('object');
        expect(blogEntity.endpoints.list).not.toBeNull();
        expect(blogEntity.endpoints.list.url).toBe('/blog');

        expect(typeof postEntity.endpoints.single).toBe('object');
        expect(postEntity.endpoints.single).not.toBeNull();
        expect(postEntity.endpoints.single.url).toBe('/blog/{blogId}/post/{id}');
        expect(typeof postEntity.endpoints.list).toBe('object');
        expect(postEntity.endpoints.list).not.toBeNull();
        expect(postEntity.endpoints.list.url).toBe('/blog/{blogId}/post');

        expect(typeof commentEntity.endpoints.single).toBe('object');
        expect(commentEntity.endpoints.single).not.toBeNull();
        expect(commentEntity.endpoints.single.url).toBe('/blog/{blogId}/post/{postId}/comment/{id}');
        expect(typeof commentEntity.endpoints.list).toBe('object');
        expect(commentEntity.endpoints.list).not.toBeNull();
        expect(commentEntity.endpoints.list.url).toBe('/blog/{blogId}/post/{postId}/comment');
      });

      it('Gets the parentEntityName', () => {
          var apiResolver = () => {};
          const parser = new SwaggerParser(blogSwaggerJson, { apiResolver });
          const entities = parser.getEntities();
          const blogEntity = entities.find(e => e.name === 'Blog') || {};
          const postEntity = entities.find(e => e.name === 'Post') || {};
          const commentEntity = entities.find(e => e.name === 'Comment') || {};
          expect(blogEntity.parentEntityName).toBe(null);
          expect(postEntity.parentEntityName).toBe('Blog');
          expect(commentEntity.parentEntityName).toBe('Post');
      });

      it(`Sets endpoints.url.list.listEntityName for entities
            that are returned from an endpoint as an object with a property containing List<Entity>`, () => {
        var apiResolver = () => {};
        const parser = new SwaggerParser(blogSwaggerJson, { apiResolver });
        const entities = parser.getEntities();
        const blogEntity = entities.find(e => e.name === 'Blog') || {};
        expect(blogEntity.endpoints.list.listEntityName).toBe('ListResultBlog');
      });

      it(`Works for list results directly on endpoint`, () => {
        var apiResolver = () => {};
        const parser = new SwaggerParser(listResultDirectlyOnEndpoint, { apiResolver });
        const entities = parser.getEntities();
        const accountEntity = entities.find(e => e.name === 'Account') || {};
        expect(accountEntity.endpoints.single).not.toBe(null);
        expect(accountEntity.endpoints.list).not.toBe(null);
        expect(accountEntity.endpoints.list.listEntityName).toBe(null);
      });

      it('Removes the endpoints from entities that are a list result object for another entity', () => {
        var apiResolver = () => {};
        const parser = new SwaggerParser(blogSwaggerJson, { apiResolver });
        const entities = parser.getEntities();
        const listOfPosts = entities.find(e => e.name === 'ListResultPost') || {};
        expect(listOfPosts.endpoints.single).toBe(undefined);
        expect(listOfPosts.endpoints.list).toBe(undefined);
      });

      it('Passes the apiResolver to each entity', () => {
        var apiResolver = () => {};
        const parser = new SwaggerParser(blogSwaggerJson, { apiResolver });
        const entities = parser.getEntities();
        expect(entities.every(e => e.apiResolver === apiResolver)).toBe(true);
      });

      it('Has the entity\'s properties', () => {
        var apiResolver = () => {};
        const parser = new SwaggerParser(blogSwaggerJson, { apiResolver });
        const entities = parser.getEntities();
        const blogEntity = entities.find(e => e.name === 'Blog') || {};
        expect(typeof blogEntity.properties).toBe('object');
        expect(blogEntity.properties).toHaveProperty('id');
      });

      it('Has the entity\'s relationships', () => {
        var apiResolver = () => {};
        const parser = new SwaggerParser(blogSwaggerJson, { apiResolver });
        const entities = parser.getEntities();
        const blogEntity = entities.find(e => e.name === 'Blog') || {};
        const postEntity = entities.find(e => e.name === 'Post') || {};

        expect(typeof blogEntity.relationships).toBe('object');
        expect(blogEntity.relationships.posts.name).toBe('Post');
        expect(blogEntity.relationships.posts.isList).toBe(true);
        expect(typeof postEntity.relationships).toBe('object');
        expect(postEntity.relationships.comments.name).toBe('Comment');
        expect(postEntity.relationships.comments.isList).toBe(true);
        expect(postEntity.relationships.createdBy.name).toBe('Account');
        expect(postEntity.relationships.createdBy.isList).toBe(false);
      });

      it('Does not include orphaned types', () => {
        var apiResolver = () => {};
        const parser = new SwaggerParser(noOrphanedTypes, { apiResolver });
        const entities = parser.getEntities();

        expect(entities.some(e => e.name === 'Account')).toBe(true)
        expect(entities.some(e => e.name === 'OrphanedType')).toBe(false)
      });

      it('Should handle having only a list endpoint for an entity', () => {
        var apiResolver = () => {};
        const parser = new SwaggerParser(onlyListEndpointJson, { apiResolver });
        const entities = parser.getEntities();
        const alertEntity = entities.find(e => e.name === 'Alert');
        const pagedAlertEntity = entities.find(e => e.name === 'PagedResultAlert');
        expect(!!alertEntity).toBe(true);
        // $FlowFixMe
        expect(alertEntity.endpoints.list).not.toBe(undefined);
        // $FlowFixMe
        expect(!!pagedAlertEntity.endpoints.list).toBe(false);
        // $FlowFixMe
        expect(!!pagedAlertEntity.endpoints.single).toBe(false);
      });
    });
  });

  describe('Resolvers', () => {
    it('Calls the apiResolver', () => {
      const apiResolver = jest.fn();
      const resolvers = generateResolvers(blogSwaggerJson, {
        apiResolver,
      });
      var postsResolver = resolvers['Blog']['posts']({ id: 123 }, { take: 10 });
      expect(apiResolver).toBeCalledWith({
        fieldName: 'posts',
        parameters: { take: 10 },
        parent: { id: 123 },
        parentType: 'Blog',
        rawUrl: '/blog/{blogId}/post',
        type: 'Post',
      });
    });
  });
});
