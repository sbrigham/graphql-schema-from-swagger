export default {
  "swagger": "2.0",
  "info": {
      "version": "v1",
      "title": "Account Api",
      "description": "",
      "termsOfService": "None"
  },
  "basePath": "/",
  "paths": {
      "/account": {
          "get": {
              "operationId": "AccountGet",
              "consumes": [],
              "produces": [
                  "text/plain",
                  "application/json",
                  "text/json"
              ],
              "parameters": [
                  {
                      "name": "Take",
                      "in": "query",
                      "required": false,
                      "type": "integer",
                      "format": "int32"
                  },
                  {
                      "name": "AccountIds",
                      "in": "query",
                      "required": false,
                      "type": "array",
                      "items": {
                          "type": "string",
                          "format": "uuid"
                      },
                      "collectionFormat": "multi"
                  },
                  {
                    "name": "Status",
                    "in": "query",
                    "required": false,
                    "type": "string",
                    "enum": [
                        "InProgress",
                        "Pending",
                        "Approved",
                        "Denied"
                    ]
                },
                {
                  "name": "Visibilities",
                  "in": "query",
                  "required": false,
                  "type": "array",
                  "items": {
                      "type": "string",
                      "enum": [
                          "Public",
                          "Private"
                      ]
                  },
                  "collectionFormat": "multi"
              },
              ],
              "responses": {
                  "200": {
                      "description": "Success",
                      "schema": {
                          "$ref": "#/definitions/PagedResult[Account]"
                      }
                  }
              }
          }
      },
      "/account/{id}": {
          "get": {
              "tags": [
                  "Member"
              ],
              "operationId": "AccountByIdGet",
              "consumes": [],
              "produces": [
                  "text/plain",
                  "application/json",
                  "text/json"
              ],
              "parameters": [
                  {
                      "name": "id",
                      "in": "path",
                      "required": true,
                      "type": "string",
                      "format": "uuid"
                  }
              ],
              "responses": {
                  "200": {
                      "description": "Success",
                      "schema": {
                          "$ref": "#/definitions/Account"
                      }
                  }
              }
          }
      },
  },
  "definitions": {
      "PagedResult[Account]": {
          "type": "object",
          "properties": {
              "skip": {
                  "format": "int32",
                  "type": "integer"
              },
              "take": {
                  "format": "int32",
                  "type": "integer"
              },
              "totalItems": {
                  "format": "int32",
                  "type": "integer"
              },
              "items": {
                  "type": "array",
                  "items": {
                      "$ref": "#/definitions/Account"
                  }
              }
          }
      },
      "Account": {
          "type": "object",
          "properties": {
              "id": {
                  "format": "uuid",
                  "type": "string"
              },
              "firstName": {
                  "type": "string"
              },
              "lastName": {
                  "type": "string"
              },
              "middleName": {
                  "type": "string"
              },
              "nickname": {
                  "type": "string"
              },
              "profileImageFilePath": {
                  "type": "string"
              },
              "socialMedia": {
                "type": "object",
                "properties": {
                  "facebookUrl": {
                    "type": "string"
                  },
                  "instagramUrl": {
                    "type": "string"
                  },
                  "linkedInUrl": {
                    "type": "string"
                  },
                  "twitterUrl": {
                    "type": "string"
                  },
                }
              },
          }
      },
    },
  "securityDefinitions": {}
}
