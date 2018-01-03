// @flow

import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';
import {
  generate,
  generateResolvers,
  generateTypes,
  schemaFromMultiple,
} from '../src/index';
import SwaggerParser from '../src/swagger-parser';
import blogSwaggerJson from '../src/example/data/api-blog.swagger';
import accountSwaggerJson from '../src/example/data/api-account.swagger';

declare var describe: any;
declare var it: any;
declare var expect: any;
declare var jest: any;

describe('Integration Tests', () => {
  describe('generate', () => {
    it('Has resolvers and typeDefs', () => {
      var result = generate(blogSwaggerJson, {
        apiResolver: () => {},
        listResultName: 'ListResult',
      });
      expect(result).toHaveProperty('resolvers');
      expect(result).toHaveProperty('typeDefs');
      expect(typeof result.typeDefs).toBe('string');
      expect(typeof result.resolvers).toBe('object');
    });

    it('Should have a paginationStrategy', () => {
      var result = generate(blogSwaggerJson, {
        apiResolver: () => {},
        listResultName: 'ListResult',
        paginationStrategy: 'NONE',
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
        listResultName: 'ListResult',
      });
      expect(resolvers).toHaveProperty('Query');
      expect(typeof resolvers.Query).toBe('object');
      expect(typeof resolvers.Query.comments).toBe('function');
      expect(typeof resolvers.Query.comment).toBe('function');
      expect(typeof resolvers.Query.blogs).toBe('function');
      expect(typeof resolvers.Query.blog).toBe('function');
      expect(typeof resolvers.Query.post).toBe('function');
      expect(typeof resolvers.Query.posts).toBe('function');
    });

    it('Has resolvers for each type', () => {
      var resolvers = generateResolvers(blogSwaggerJson, {
        apiResolver: () => {},
        listResultName: 'ListResult',
      });
      expect(typeof resolvers.Comment).toBe('object');
      expect(typeof resolvers.Post.comments).toBe('function');
      expect(typeof resolvers.Blog.posts).toBe('function');
    });
  });

  describe('generateTypes', () => {
    describe('No pagination strategy', () => {
      it('Should return a GraphqlSchema', () => {
        expect(
          typeof generateTypes(blogSwaggerJson, {
            listResultName: 'ListResult',
            apiResolver: () => {},
          })
        ).toBe('object');
        expect(
          generateTypes(blogSwaggerJson, {
            listResultName: 'ListResult',
            apiResolver: () => {},
          }).constructor.name
        ).toBe('GraphQLSchema');
      });

      it('Should generate a root query type', () => {
        const queryTypeFields = generateTypes(blogSwaggerJson, {
          listResultName: 'ListResult',
          apiResolver: () => {},
        })
          .getQueryType()
          .getFields();
        expect(typeof queryTypeFields.comment).toBe('object');
        expect(typeof queryTypeFields.comments).toBe('object');
        expect(typeof queryTypeFields.post).toBe('object');
        expect(typeof queryTypeFields.posts).toBe('object');
        expect(typeof queryTypeFields.blog).toBe('object');
        expect(typeof queryTypeFields.blogs).toBe('object');
      });

      it('Should generate a root query type with arguments', () => {
        const queryTypeFields = generateTypes(blogSwaggerJson, {
          listResultName: 'ListResult',
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
          listResultName: 'ListResult',
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
        expect(typeof blogType.deleted).toBe('object');
      });

      it('Should generate types with arguments', () => {
        const blogType = generateTypes(blogSwaggerJson, {
          listResultName: 'ListResult',
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
          listResultName: 'ListResult',
          apiResolver: () => {},
        })
        .getType('Blog')
        .getFields();

        const postArguments = blogType.posts.args;
        expect(postArguments.find(a => a.name === 'blogId').type).toBe(
          GraphQLInt
        );
      });
    });

    describe('Simple pagination strategy', () => {
      it('Should generate types', () => {
        const blogType = generateTypes(blogSwaggerJson, {
          listResultName: 'ListResult',
          apiResolver: () => {},
          paginationStrategy: 'SIMPLE',
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
        expect(typeof blogType.deleted).toBe('object');
      });

      it('Should have totalItems and items on lists', () => {
        const types = generateTypes(blogSwaggerJson, {
          listResultName: 'ListResult',
          apiResolver: () => {},
          paginationStrategy: 'SIMPLE',
        });

        const blogType = types.getType('Blog')
        .getFields();
        expect(typeof blogType.posts).toBe('object');
        expect(blogType.posts.type.toString()).toBe('PostsContainer');

        const postContainerFields = types.getType('PostsContainer').getFields();
        expect(postContainerFields.totalItems.type).toEqual(new GraphQLNonNull(GraphQLInt));
        expect(postContainerFields.items.type.toString()).toEqual('[Post]');
      });

      it('Should have arguments on list items', () => {
        const types = generateTypes(blogSwaggerJson, {
          listResultName: 'ListResult',
          apiResolver: () => {},
          paginationStrategy: 'SIMPLE',
        });

        const blogType = types.getType('Blog').getFields();
        expect(blogType.posts.args.some(a => a.name === 'count')).toBe(true);
        expect(blogType.posts.args.some(a => a.name === 'blogId')).toBe(true);
        expect(blogType.posts.args.some(a => a.name === 'sinceId')).toBe(true);
        expect(blogType.posts.args.some(a => a.name === 'maxId')).toBe(true);
      });
    });
  });

  describe('schemaFromMultiple', () => {
    it('Should have resolvers and typeDefs', () => {
      var result = schemaFromMultiple([
        {
          swaggerJson: blogSwaggerJson,
          options: {
            listResultName: 'ListResult',
            apiResolver: () => {},
          },
        },
        {
          swaggerJson: accountSwaggerJson,
          options: {
            listResultName: 'ListResult',
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
            listResultName: 'ListResult',
            apiResolver: () => {},
          },
        },
        {
          swaggerJson: accountSwaggerJson,
          options: {
            listResultName: 'ListResult',
            apiResolver: () => {},
          },
        },
      ]);

      const resolvers = result.resolvers;
      expect(resolvers.Post).toHaveProperty('createdBy');
      expect(typeof resolvers.Post.createdBy).toBe('function');
      expect(typeof resolvers.Account).toBe('object');
      expect(typeof resolvers.Query.account).toBe('function');
    });
  });
});

describe('Unit Tests', () => {
  describe('Swagger Parser', () => {
    it('Requires a swaggerJson file, and options', () => {
      expect(() => new SwaggerParser(blogSwaggerJson)).toThrow();
      expect(() => new SwaggerParser()).toThrow();
      expect(() => new SwaggerParser({})).toThrow();
      expect(
        () =>
          new SwaggerParser(blogSwaggerJson, {
            apiResolver: () => {},
            listResultName: 'Test',
          })
      ).not.toThrow();
    });
  });

  describe('Resolvers', () => {
    it('Calls the apiResolver', () => {
      const apiResolver = jest.fn();
      const resolvers = generateResolvers(blogSwaggerJson, {
        apiResolver,
        listResultName: 'ListResult',
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
