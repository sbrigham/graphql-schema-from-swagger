export default {
  swagger: '2.0',
  info: {
    version: 'v1',
    title: 'Blog Api',
    description: '',
    termsOfService: 'None',
  },
  basePath: '/',
  paths: {
    '/blog/{blogId}/post/{postId}/comment': {
      get: {
        tags: ['Comment'],
        operationId: 'BlogByBlogIdPostByPostIdCommentGet',
        consumes: [],
        produces: ['text/plain', 'application/json', 'text/json'],
        parameters: [
          {
            name: 'blogId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'postId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'PostId',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'SinceId',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'MaxId',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'Count',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'BlogId',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            'schema': {
              '$ref': '#/definitions/ListResult.Comment'
            }
          },
        },
      },
      post: {
        tags: ['Comment'],
        operationId: 'BlogByBlogIdPostByPostIdCommentPost',
        consumes: [
          'application/json',
          'text/json',
          'application/json-patch+json',
        ],
        produces: ['text/plain', 'application/json', 'text/json'],
        parameters: [
          {
            name: 'blogId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'postId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'comment',
            in: 'body',
            required: false,
            schema: {
              $ref: '#/definitions/Comment',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: {
              $ref: '#/definitions/Comment',
            },
          },
        },
      },
    },
    '/blog/{blogId}/post/{postId}/comment/{id}': {
      get: {
        tags: ['Comment'],
        operationId: 'BlogByBlogIdPostByPostIdCommentByIdGet',
        consumes: [],
        produces: ['text/plain', 'application/json', 'text/json'],
        parameters: [
          {
            name: 'blogId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'postId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: {
              $ref: '#/definitions/Comment',
            },
          },
        },
      },
      put: {
        tags: ['Comment'],
        operationId: 'BlogByBlogIdPostByPostIdCommentByIdPut',
        consumes: [
          'application/json',
          'text/json',
          'application/json-patch+json',
        ],
        produces: ['text/plain', 'application/json', 'text/json'],
        parameters: [
          {
            name: 'blogId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'postId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'comment',
            in: 'body',
            required: false,
            schema: {
              $ref: '#/definitions/Comment',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: {
              $ref: '#/definitions/Comment',
            },
          },
        },
      },
      delete: {
        tags: ['Comment'],
        operationId: 'BlogByBlogIdPostByPostIdCommentByIdDelete',
        consumes: [],
        produces: [],
        parameters: [
          {
            name: 'blogId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'postId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/blog': {
      get: {
        tags: ['Blog'],
        operationId: 'BlogGet',
        consumes: [],
        produces: ['text/plain', 'application/json', 'text/json'],
        parameters: [
          {
            name: 'SinceId',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'MaxId',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'Count',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: {
              $ref: '#/definitions/ListResult[Blog]',
            },
          },
        },
      },
      post: {
        tags: ['Blog'],
        operationId: 'BlogPost',
        consumes: [
          'application/json',
          'text/json',
          'application/json-patch+json',
        ],
        produces: ['text/plain', 'application/json', 'text/json'],
        parameters: [
          {
            name: 'blog',
            in: 'body',
            required: false,
            schema: {
              $ref: '#/definitions/Blog',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: {
              $ref: '#/definitions/Blog',
            },
          },
        },
      },
    },
    '/blog/{id}': {
      get: {
        tags: ['Blog'],
        operationId: 'BlogByIdGet',
        consumes: [],
        produces: ['text/plain', 'application/json', 'text/json'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: {
              $ref: '#/definitions/Blog',
            },
          },
        },
      },
      put: {
        tags: ['Blog'],
        operationId: 'BlogByIdPut',
        consumes: [
          'application/json',
          'text/json',
          'application/json-patch+json',
        ],
        produces: ['text/plain', 'application/json', 'text/json'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'blog',
            in: 'body',
            required: false,
            schema: {
              $ref: '#/definitions/Blog',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: {
              $ref: '#/definitions/Blog',
            },
          },
        },
      },
      delete: {
        tags: ['Blog'],
        operationId: 'BlogByIdDelete',
        consumes: [],
        produces: [],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/graphql': {
      get: {
        tags: ['Graphql'],
        operationId: 'GraphqlGet',
        consumes: [],
        produces: [],
        parameters: [
          {
            name: 'SinceId',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'MaxId',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'Count',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/': {
      get: {
        tags: ['Home'],
        operationId: 'Get',
        consumes: [],
        produces: [],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/blog/{blogId}/post': {
      get: {
        tags: ['Post'],
        operationId: 'BlogByBlogIdPostGet',
        consumes: [],
        produces: ['text/plain', 'application/json', 'text/json'],
        parameters: [
          {
            name: 'blogId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'sinceId',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'maxId',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'count',
            in: 'query',
            required: false,
            type: 'integer',
            format: 'int32',
          }
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: {
              $ref: '#/definitions/ListResult[Post]',
            },
          },
        },
      },
      post: {
        tags: ['Post'],
        operationId: 'BlogByBlogIdPostPost',
        consumes: [
          'application/json',
          'text/json',
          'application/json-patch+json',
        ],
        produces: ['text/plain', 'application/json', 'text/json'],
        parameters: [
          {
            name: 'blogId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'post',
            in: 'body',
            required: false,
            schema: {
              $ref: '#/definitions/Post',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: {
              $ref: '#/definitions/Post',
            },
          },
        },
      },
    },
    '/blog/{blogId}/post/{id}': {
      get: {
        tags: ['Post'],
        operationId: 'BlogByBlogIdPostByIdGet',
        consumes: [],
        produces: ['text/plain', 'application/json', 'text/json'],
        parameters: [
          {
            name: 'blogId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: {
              $ref: '#/definitions/Post',
            },
          },
        },
      },
      put: {
        tags: ['Post'],
        operationId: 'BlogByBlogIdPostByIdPut',
        consumes: [
          'application/json',
          'text/json',
          'application/json-patch+json',
        ],
        produces: ['text/plain', 'application/json', 'text/json'],
        parameters: [
          {
            name: 'blogId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'post',
            in: 'body',
            required: false,
            schema: {
              $ref: '#/definitions/Post',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
            schema: {
              $ref: '#/definitions/Post',
            },
          },
        },
      },
      delete: {
        tags: ['Post'],
        operationId: 'BlogByBlogIdPostByIdDelete',
        consumes: [],
        produces: [],
        parameters: [
          {
            name: 'blogId',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'integer',
            format: 'int32',
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
  },
  definitions: {
    'ListResult.Comment': {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            $ref: '#/definitions/Comment',
          },
        },
        sinceId: {
          format: 'int32',
          type: 'integer',
        },
        maxId: {
          format: 'int32',
          type: 'integer',
        },
        count: {
          format: 'int32',
          type: 'integer',
        },
        totalItems: {
          format: 'int32',
          type: 'integer',
        },
      },
    },
    Comment: {
      type: 'object',
      properties: {
        id: {
          format: 'int32',
          type: 'integer',
        },
        blogId: {
          format: 'int32',
          type: 'integer',
        },
        postId: {
          format: 'int32',
          type: 'integer',
        },
        text: {
          type: 'string',
        },
        createdBy: {
          $ref: '#/definitions/Account',
        },
        createdOn: {
          format: 'date-time',
          type: 'string',
        },
        updatedOn: {
          format: 'date-time',
          type: 'string',
        },
        deleted: {
          type: 'boolean',
        },
      },
    },
    Account: {
      type: 'object',
      properties: {
        accountId: {
          format: 'uuid',
          type: 'string',
        },
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        profileImageFilePath: {
          type: 'string',
        },
      },
    },
    'ListResult[Blog]': {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            $ref: '#/definitions/Blog',
          },
        },
        sinceId: {
          format: 'int32',
          type: 'integer',
        },
        maxId: {
          format: 'int32',
          type: 'integer',
        },
        count: {
          format: 'int32',
          type: 'integer',
        },
        totalItems: {
          format: 'int32',
          type: 'integer',
        },
      },
    },
    Blog: {
      type: 'object',
      properties: {
        id: {
          format: 'int32',
          type: 'integer',
        },
        name: {
          type: 'string',
        },
        createdOn: {
          format: 'date-time',
          type: 'string',
        },
        updatedOn: {
          format: 'date-time',
          type: 'string',
        },
        createdBy: {
          format: 'uuid',
          type: 'string',
        },
        postCount: {
          format: 'int32',
          type: 'integer',
        },
        posts: {
          type: 'array',
          items: {
            $ref: '#/definitions/Post',
          },
        },
        deleted: {
          type: 'boolean',
        },
      },
    },
    Post: {
      type: 'object',
      properties: {
        id: {
          format: 'int32',
          type: 'integer',
        },
        blogId: {
          format: 'int32',
          type: 'integer',
        },
        text: {
          type: 'string',
        },
        createdBy: {
          $ref: '#/definitions/Account',
        },
        createdOn: {
          format: 'date-time',
          type: 'string',
        },
        updatedOn: {
          format: 'date-time',
          type: 'string',
        },
        deleted: {
          type: 'boolean',
        },
        commentCount: {
          format: 'int32',
          type: 'integer',
        },
        recentComments: {
          type: 'array',
          items: {
            $ref: '#/definitions/Comment',
          },
        },
        comments: {
          type: 'array',
          items: {
            $ref: '#/definitions/Comment',
          },
        },
      },
    },
    'ListResult[Post]': {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            $ref: '#/definitions/Post',
          },
        },
        sinceId: {
          format: 'int32',
          type: 'integer',
        },
        maxId: {
          format: 'int32',
          type: 'integer',
        },
        count: {
          format: 'int32',
          type: 'integer',
        },
        totalItems: {
          format: 'int32',
          type: 'integer',
        },
      },
    },
  },
  securityDefinitions: {},
};
