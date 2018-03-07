export default {
  "swagger": "2.0",
  "info": {
    "version": "v1",
    "title": "Pillar.Organizations",
    "description": "",
    "termsOfService": "None"
  },
  "basePath": "/",
  "paths": {
    "/organization/{orgId}/additionalfields": {
      "get": {
        "tags": [
          "AdditionalFields"
        ],
        "operationId": "OrganizationByOrgIdAdditionalfieldsGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "orgId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "accountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/branch": {
      "get": {
        "tags": [
          "Branch"
        ],
        "operationId": "BranchGet",
        "consumes": [

        ],
        "produces": [
          "text/plain",
          "application/json",
          "text/json"
        ],
        "parameters": [
          {
            "name": "Name",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "IncludeNewOrgReg",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "IsNewOrgRegAvailable",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "BranchAdministratorAccountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "InstitutionId",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "LegacyOrganizationKey",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "CommunityId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "HasMembers",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "HasInvitations",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "MemberAccountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "WebsiteKey",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrgIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "IsBranch",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "IncludeReregistration",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "IsReregAvailable",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "IncludeSocialMedia",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "IncludeContactInfo",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "Statuses",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "Active",
                "Inactive",
                "Frozen",
                "Locked",
                "RespectCommunityFrozen"
              ]
            },
            "collectionFormat": "multi"
          },
          {
            "name": "OrganizationCategoryIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "OrganizationTypeIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "DiscussionId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/PagedResult[Branch]"
            }
          }
        }
      },
      "post": {
        "tags": [
          "Branch"
        ],
        "operationId": "BranchPost",
        "consumes": [
          "application/json-patch+json",
          "application/json",
          "text/json",
          "application/*+json"
        ],
        "produces": [
          "text/plain",
          "application/json",
          "text/json"
        ],
        "parameters": [
          {
            "name": "branch",
            "in": "body",
            "required": false,
            "schema": {
              "$ref": "#/definitions/Branch"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/Branch"
            }
          }
        }
      }
    },
    "/branch/{id}": {
      "get": {
        "tags": [
          "Branch"
        ],
        "operationId": "BranchByIdGet",
        "consumes": [

        ],
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
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/Branch"
            }
          }
        }
      },
      "put": {
        "tags": [
          "Branch"
        ],
        "operationId": "BranchByIdPut",
        "consumes": [
          "application/json-patch+json",
          "application/json",
          "text/json",
          "application/*+json"
        ],
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
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "branch",
            "in": "body",
            "required": false,
            "schema": {
              "$ref": "#/definitions/Branch"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/Branch"
            }
          }
        }
      }
    },
    "/branch/changeBranch": {
      "post": {
        "tags": [
          "Branch"
        ],
        "operationId": "BranchChangeBranchPost",
        "consumes": [
          "application/json-patch+json",
          "application/json",
          "text/json",
          "application/*+json"
        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "changeBranch",
            "in": "body",
            "required": false,
            "schema": {
              "$ref": "#/definitions/ChangeBranchParameters"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/category": {
      "get": {
        "tags": [
          "Category"
        ],
        "operationId": "CategoryGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "InstitutionId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "ShownOnPublicSite",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/": {
      "get": {
        "tags": [
          "Home"
        ],
        "operationId": "Get",
        "consumes": [

        ],
        "produces": [

        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/invitation": {
      "get": {
        "tags": [
          "Invitation"
        ],
        "operationId": "OrganizationByOrganizationIdInvitationGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrganizationId",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "AccountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "EmailAddress",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/invitation/{invitationId}": {
      "get": {
        "tags": [
          "Invitation"
        ],
        "operationId": "OrganizationByOrganizationIdInvitationByInvitationIdGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "invitationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      },
      "put": {
        "tags": [
          "Invitation"
        ],
        "operationId": "OrganizationByOrganizationIdInvitationByInvitationIdPut",
        "consumes": [
          "application/json-patch+json",
          "application/json",
          "text/json",
          "application/*+json"
        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "invitationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "invitation",
            "in": "body",
            "required": false,
            "schema": {
              "$ref": "#/definitions/Invitation"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/invitation/{invitationId}/reject": {
      "post": {
        "tags": [
          "Invitation"
        ],
        "operationId": "OrganizationByOrganizationIdInvitationByInvitationIdRejectPost",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "invitationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/invitation/{invitationId}/accept": {
      "post": {
        "tags": [
          "Invitation"
        ],
        "operationId": "OrganizationByOrganizationIdInvitationByInvitationIdAcceptPost",
        "consumes": [
          "application/json-patch+json",
          "application/json",
          "text/json",
          "application/*+json"
        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "invitationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "invite",
            "in": "body",
            "required": false,
            "schema": {
              "$ref": "#/definitions/Invitation"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/invitation": {
      "get": {
        "tags": [
          "Invitation"
        ],
        "operationId": "InvitationGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "OrganizationId",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "AccountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "EmailAddress",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/legacy/{id}": {
      "get": {
        "tags": [
          "LegacyOrganization"
        ],
        "operationId": "OrganizationLegacyByIdGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/member": {
      "get": {
        "tags": [
          "Member"
        ],
        "operationId": "OrganizationByOrganizationIdMemberGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "InstitutionId",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrganizationId",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "AccountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "IncludePermissions",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "PrivacySettings",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "Unselected",
                "Show",
                "Hide"
              ]
            },
            "collectionFormat": "multi"
          },
          {
            "name": "IncludePositions",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/member/{id}": {
      "get": {
        "tags": [
          "Member"
        ],
        "operationId": "OrganizationByOrganizationIdMemberByIdGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/MembershipRecord": {
      "get": {
        "tags": [
          "MemberHistory"
        ],
        "operationId": "OrganizationByOrganizationIdMembershipRecordGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "InstitutionId",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrganizationId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "AccountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "IncludePermissions",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "PrivacySettings",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "Unselected",
                "Show",
                "Hide"
              ]
            },
            "collectionFormat": "multi"
          },
          {
            "name": "TemplateIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "OrganizationIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "StartDate",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "date-time"
          },
          {
            "name": "EndDate",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "date-time"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/MembershipRecord/{id}": {
      "get": {
        "tags": [
          "MemberHistory"
        ],
        "operationId": "OrganizationByOrganizationIdMembershipRecordByIdGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/MembershipRecord": {
      "get": {
        "tags": [
          "MemberHistory"
        ],
        "operationId": "MembershipRecordGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "InstitutionId",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrganizationId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "AccountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "IncludePermissions",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "PrivacySettings",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "Unselected",
                "Show",
                "Hide"
              ]
            },
            "collectionFormat": "multi"
          },
          {
            "name": "TemplateIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "OrganizationIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "StartDate",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "date-time"
          },
          {
            "name": "EndDate",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "date-time"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/member/{accountId}/permissions": {
      "get": {
        "tags": [
          "MemberPermission"
        ],
        "operationId": "OrganizationByOrganizationIdMemberByAccountIdPermissionsGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "accountId",
            "in": "path",
            "required": true,
            "type": "string",
            "format": "uuid"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/request": {
      "get": {
        "tags": [
          "MembershipRequest"
        ],
        "operationId": "OrganizationByOrganizationIdRequestGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "AccountId",
            "in": "query",
            "required": true,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "OrganizationId",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      },
      "post": {
        "tags": [
          "MembershipRequest"
        ],
        "operationId": "OrganizationByOrganizationIdRequestPost",
        "consumes": [
          "application/json-patch+json",
          "application/json",
          "text/json",
          "application/*+json"
        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "request",
            "in": "body",
            "required": false,
            "schema": {
              "$ref": "#/definitions/MembershipRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/membershipstatus": {
      "get": {
        "tags": [
          "MembershipStatus"
        ],
        "operationId": "OrganizationByOrganizationIdMembershipstatusGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "accountIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "string",
              "format": "uuid"
            },
            "collectionFormat": "multi"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization": {
      "get": {
        "tags": [
          "Organization"
        ],
        "operationId": "OrganizationGet",
        "consumes": [

        ],
        "produces": [
          "text/plain",
          "application/json",
          "text/json"
        ],
        "parameters": [
          {
            "name": "InstitutionId",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "LegacyOrganizationKey",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "CommunityId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "HasMembers",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "HasInvitations",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "MemberAccountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "WebsiteKey",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrgIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "IsBranch",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "IncludeReregistration",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "IsReregAvailable",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "IncludeSocialMedia",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "IncludeContactInfo",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "Name",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "Statuses",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "Active",
                "Inactive",
                "Frozen",
                "Locked",
                "RespectCommunityFrozen"
              ]
            },
            "collectionFormat": "multi"
          },
          {
            "name": "OrganizationCategoryIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "OrganizationTypeIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "DiscussionId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/PagedResult[Organization]"
            }
          }
        }
      },
      "post": {
        "tags": [
          "Organization"
        ],
        "operationId": "OrganizationPost",
        "consumes": [
          "application/json-patch+json",
          "application/json",
          "text/json",
          "application/*+json"
        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organization",
            "in": "body",
            "required": false,
            "schema": {
              "$ref": "#/definitions/Organization"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{id}": {
      "get": {
        "tags": [
          "Organization"
        ],
        "operationId": "OrganizationByIdGet",
        "consumes": [

        ],
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
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/Organization"
            }
          }
        }
      }
    },
    "/organizationType": {
      "get": {
        "tags": [
          "OrganizationType"
        ],
        "operationId": "OrganizationTypeGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "InstitutionId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organizationType/{organizationTypeId}": {
      "get": {
        "tags": [
          "OrganizationType"
        ],
        "operationId": "OrganizationTypeByOrganizationTypeIdGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationTypeId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/position": {
      "get": {
        "tags": [
          "Position"
        ],
        "operationId": "OrganizationByOrganizationIdPositionGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrganizationId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "InstitutionId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "PrivacySettings",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "Unselected",
                "Show",
                "Hide"
              ]
            },
            "collectionFormat": "multi"
          },
          {
            "name": "AccountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "IsOfficer",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "Unbounded",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "PositionIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "IsVisibleOnRoster",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "IsPositionTypeActive",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/position/{positionId}": {
      "get": {
        "tags": [
          "Position"
        ],
        "operationId": "OrganizationByOrganizationIdPositionByPositionIdGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "positionId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      },
      "put": {
        "tags": [
          "Position"
        ],
        "operationId": "OrganizationByOrganizationIdPositionByPositionIdPut",
        "consumes": [
          "application/json-patch+json",
          "application/json",
          "text/json",
          "application/*+json"
        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "position",
            "in": "body",
            "required": false,
            "schema": {
              "$ref": "#/definitions/Position"
            }
          },
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "positionId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/PositionHistory": {
      "get": {
        "tags": [
          "PositionHistory"
        ],
        "operationId": "OrganizationByOrganizationIdPositionHistoryGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "InstitutionId",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrganizationId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "AccountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "PositionTemplateIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "MustHoldAllPositions",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "StartDate",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "date-time"
          },
          {
            "name": "EndDate",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "date-time"
          },
          {
            "name": "OrganizationIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/PositionHistory/{id}": {
      "get": {
        "tags": [
          "PositionHistory"
        ],
        "operationId": "OrganizationByOrganizationIdPositionHistoryByIdGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/PositionHistory": {
      "get": {
        "tags": [
          "PositionHistory"
        ],
        "operationId": "PositionHistoryGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "InstitutionId",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrganizationId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "AccountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "PositionTemplateIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "MustHoldAllPositions",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "StartDate",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "date-time"
          },
          {
            "name": "EndDate",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "date-time"
          },
          {
            "name": "OrganizationIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/holders": {
      "get": {
        "tags": [
          "PositionHolder"
        ],
        "operationId": "OrganizationByOrganizationIdHoldersGet",
        "consumes": [

        ],
        "produces": [
          "text/plain",
          "application/json",
          "text/json"
        ],
        "parameters": [
          {
            "name": "OrganizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/PagedResult[PositionHolder]"
            }
          }
        }
      }
    },
    "/positionTemplate": {
      "get": {
        "tags": [
          "PositionTemplate"
        ],
        "operationId": "PositionTemplateGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "Name",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "BranchId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "InstitutionId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "ExcludeOrganizationCreated",
            "in": "query",
            "required": true,
            "type": "boolean"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/positionTemplate/{positionTemplateId}": {
      "get": {
        "tags": [
          "PositionTemplate"
        ],
        "operationId": "PositionTemplateByPositionTemplateIdGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "positionTemplateId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/organization/{organizationId}/socialmediasettings": {
      "get": {
        "tags": [
          "SocialMediaSettings"
        ],
        "operationId": "OrganizationByOrganizationIdSocialmediasettingsGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/position": {
      "get": {
        "tags": [
          "UpdatedPosition"
        ],
        "operationId": "PositionGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "OrganizationId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "InstitutionId",
            "in": "query",
            "required": false,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "PrivacySettings",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "Unselected",
                "Show",
                "Hide"
              ]
            },
            "collectionFormat": "multi"
          },
          {
            "name": "AccountId",
            "in": "query",
            "required": false,
            "type": "string",
            "format": "uuid"
          },
          {
            "name": "IsOfficer",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "Unbounded",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "PositionIds",
            "in": "query",
            "required": false,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int32"
            },
            "collectionFormat": "multi"
          },
          {
            "name": "IsVisibleOnRoster",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "IsPositionTypeActive",
            "in": "query",
            "required": false,
            "type": "boolean"
          },
          {
            "name": "Skip",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "Take",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "OrderByField",
            "in": "query",
            "required": false,
            "type": "string"
          },
          {
            "name": "OrderByDirection",
            "in": "query",
            "required": true,
            "type": "string",
            "enum": [
              "Ascending",
              "Descending"
            ]
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/position/{positionId}": {
      "get": {
        "tags": [
          "UpdatedPosition"
        ],
        "operationId": "PositionByPositionIdGet",
        "consumes": [

        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "organizationId",
            "in": "query",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "positionId",
            "in": "path",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      },
      "put": {
        "tags": [
          "UpdatedPosition"
        ],
        "operationId": "PositionByPositionIdPut",
        "consumes": [
          "application/json-patch+json",
          "application/json",
          "text/json",
          "application/*+json"
        ],
        "produces": [

        ],
        "parameters": [
          {
            "name": "position",
            "in": "body",
            "required": false,
            "schema": {
              "$ref": "#/definitions/Position"
            }
          },
          {
            "name": "positionId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    }
  },
  "definitions": {
    "PagedResult[Branch]": {
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
            "$ref": "#/definitions/Branch"
          }
        }
      }
    },
    "Branch": {
      "type": "object",
      "properties": {
        "newOrganizationRegistrationId": {
          "format": "int32",
          "type": "integer"
        },
        "newOrganizationRegistration": {
          "$ref": "#/definitions/Registration"
        },
        "isVisible": {
          "type": "boolean"
        },
        "id": {
          "format": "int32",
          "type": "integer"
        },
        "communityId": {
          "format": "int32",
          "type": "integer"
        },
        "institutionId": {
          "format": "int32",
          "type": "integer"
        },
        "name": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "nameSortKey": {
          "type": "string"
        },
        "websiteKey": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "summary": {
          "type": "string"
        },
        "status": {
          "type": "string"
        },
        "comment": {
          "type": "string"
        },
        "showJoin": {
          "type": "boolean"
        },
        "statusChangeDateTime": {
          "format": "date-time",
          "type": "string"
        },
        "startDate": {
          "format": "date-time",
          "type": "string"
        },
        "endDate": {
          "format": "date-time",
          "type": "string"
        },
        "parentId": {
          "format": "int32",
          "type": "integer"
        },
        "wallId": {
          "format": "int32",
          "type": "integer"
        },
        "discussionId": {
          "format": "int32",
          "type": "integer"
        },
        "groupTypeId": {
          "format": "int32",
          "type": "integer"
        },
        "organizationTypeId": {
          "format": "int32",
          "type": "integer"
        },
        "cssConfigurationId": {
          "format": "int32",
          "type": "integer"
        },
        "deleted": {
          "type": "boolean"
        },
        "enableGoogleCalendar": {
          "type": "boolean"
        },
        "modifiedOn": {
          "format": "date-time",
          "type": "string"
        },
        "profilePicture": {
          "type": "string"
        },
        "organizationType": {
          "$ref": "#/definitions/OrganizationType"
        },
        "primaryContact": {
          "$ref": "#/definitions/AccountSlim"
        },
        "isBranch": {
          "type": "boolean"
        },
        "socialMedia": {
          "type": "object",
          "properties": {
            "ExternalWebsite": {
              "type": "string"
            },
            "FacebookUrl": {
              "type": "string"
            },
            "FlickrUrl": {
              "type": "string"
            },
            "GoogleCalendarUrl": {
              "type": "string"
            },
            "GooglePlusUrl": {
              "type": "string"
            },
            "InstagramUrl": {
              "type": "string"
            },
            "LinkedInUrl": {
              "type": "string"
            },
            "PinterestUrl": {
              "type": "string"
            },
            "TumblrUrl": {
              "type": "string"
            },
            "TwitterUrl": {
              "type": "string"
            },
            "TwitterUserName": {
              "type": "string"
            },
            "VimeoUrl": {
              "type": "string"
            },
            "YoutubeUrl": {
              "type": "string"
            }
          }
        },
        "contactInfo": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/OrganizationContactInfo"
          }
        },
        "legacyKey": {
          "format": "int32",
          "type": "integer"
        },
        "parentLegacyKey": {
          "format": "int32",
          "type": "integer"
        },
        "legacyPrimaryContactKey": {
          "format": "int32",
          "type": "integer"
        },
        "showFacebookWall": {
          "type": "boolean"
        },
        "showTwitterFeed": {
          "type": "boolean"
        },
        "submissions": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/RegistrationSubmission"
          }
        },
        "visibility": {
          "enum": [
            "Public",
            "Institution",
            "Organization",
            "Private"
          ],
          "type": "string"
        }
      }
    },
    "Registration": {
      "type": "object",
      "properties": {
        "id": {
          "format": "int32",
          "type": "integer"
        },
        "formId": {
          "format": "uuid",
          "type": "string"
        },
        "institutionId": {
          "format": "int32",
          "type": "integer"
        },
        "name": {
          "type": "string"
        },
        "daysRestricted": {
          "format": "int32",
          "type": "integer"
        },
        "startDateTime": {
          "format": "date-time",
          "type": "string"
        },
        "endDateTime": {
          "format": "date-time",
          "type": "string"
        }
      }
    },
    "OrganizationType": {
      "type": "object",
      "properties": {
        "id": {
          "format": "int32",
          "type": "integer"
        },
        "name": {
          "type": "string"
        },
        "autoApproveRequests": {
          "type": "boolean"
        },
        "showMembersToPublic": {
          "type": "boolean"
        },
        "showOfficersToPublic": {
          "type": "boolean"
        },
        "eventsEnabled": {
          "type": "boolean"
        },
        "serviceHoursEnabled": {
          "type": "boolean"
        },
        "financeEnabled": {
          "type": "boolean"
        },
        "reRegistrationAvailabilty": {
          "$ref": "#/definitions/ReRegistrationAvailability"
        },
        "electionsEnabled": {
          "type": "boolean"
        },
        "formsEnabled": {
          "type": "boolean"
        },
        "galleryEnabled": {
          "type": "boolean"
        },
        "outcomesEnabled": {
          "type": "boolean"
        },
        "rosterEnabled": {
          "type": "boolean"
        },
        "shownInPublicDirectory": {
          "type": "boolean"
        },
        "documentsEnabled": {
          "type": "boolean"
        },
        "isSystemType": {
          "type": "boolean"
        }
      }
    },
    "AccountSlim": {
      "type": "object",
      "properties": {
        "id": {
          "format": "uuid",
          "type": "string"
        },
        "firstName": {
          "type": "string"
        },
        "preferredFirstName": {
          "type": "string"
        },
        "lastName": {
          "type": "string"
        },
        "primaryEmailAddress": {
          "type": "string"
        },
        "profileImageFilePath": {
          "type": "string"
        },
        "institutionId": {
          "format": "int32",
          "type": "integer"
        },
        "privacy": {
          "enum": [
            "Unselected",
            "Show",
            "Hide"
          ],
          "type": "string"
        }
      }
    },
    "OrganizationContactInfo": {
      "type": "object",
      "properties": {
        "id": {
          "format": "int32",
          "type": "integer"
        },
        "addressType": {
          "format": "int32",
          "type": "integer"
        },
        "city": {
          "type": "string"
        },
        "country": {
          "type": "string"
        },
        "deleted": {
          "type": "boolean"
        },
        "extension": {
          "type": "string"
        },
        "faxNumber": {
          "type": "string"
        },
        "organizationId": {
          "format": "int32",
          "type": "integer"
        },
        "phoneNumber": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "street1": {
          "type": "string"
        },
        "street2": {
          "type": "string"
        },
        "zip": {
          "type": "string"
        }
      }
    },
    "RegistrationSubmission": {
      "type": "object",
      "properties": {
        "registrationId": {
          "format": "int32",
          "type": "integer"
        },
        "submissionId": {
          "format": "int32",
          "type": "integer"
        },
        "status": {
          "type": "string"
        }
      }
    },
    "ReRegistrationAvailability": {
      "type": "object",
      "properties": {
        "restrictionType": {
          "enum": [
            "Off",
            "On",
            "DateRestricted"
          ],
          "type": "string"
        },
        "positionHolders": {
          "$ref": "#/definitions/RestrictionGroup"
        },
        "primaryContact": {
          "$ref": "#/definitions/RestrictionGroup"
        },
        "members": {
          "$ref": "#/definitions/RestrictionGroup"
        },
        "registrationId": {
          "format": "int32",
          "type": "integer"
        },
        "nonMembers": {
          "$ref": "#/definitions/RestrictionGroup"
        }
      }
    },
    "RestrictionGroup": {
      "type": "object",
      "properties": {
        "positionTemplates": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/PositionTemplate"
          }
        },
        "start": {
          "format": "date-time",
          "type": "string"
        },
        "end": {
          "format": "date-time",
          "type": "string"
        }
      }
    },
    "PositionTemplate": {
      "type": "object",
      "properties": {
        "id": {
          "format": "int32",
          "type": "integer"
        },
        "communityId": {
          "format": "int32",
          "type": "integer"
        },
        "name": {
          "type": "string"
        },
        "isSystemTemplate": {
          "type": "boolean"
        },
        "legacyKey": {
          "format": "int32",
          "type": "integer"
        },
        "description": {
          "type": "string"
        },
        "positionTypeId": {
          "format": "int32",
          "type": "integer"
        },
        "positionType": {
          "$ref": "#/definitions/PositionType"
        },
        "isAdminOnly": {
          "type": "boolean"
        },
        "canRequestEventLocation": {
          "type": "boolean"
        },
        "autoApproveRequests": {
          "type": "boolean"
        },
        "createSystemPosition": {
          "type": "boolean"
        },
        "isVisibleOnRoster": {
          "type": "boolean"
        },
        "nameIsLocked": {
          "type": "boolean"
        },
        "securityIsLocked": {
          "type": "boolean"
        },
        "deleted": {
          "type": "boolean"
        },
        "isVisibleOnCct": {
          "type": "boolean"
        },
        "allowDescriptionOnTranscript": {
          "type": "boolean"
        },
        "eventReviewer": {
          "type": "boolean"
        },
        "eventApprover": {
          "type": "boolean"
        },
        "branchId": {
          "format": "int32",
          "type": "integer"
        }
      }
    },
    "PositionType": {
      "type": "object",
      "properties": {
        "id": {
          "format": "int32",
          "type": "integer"
        },
        "name": {
          "type": "string"
        }
      }
    },
    "ChangeBranchParameters": {
      "type": "object",
      "properties": {
        "communityId": {
          "format": "int32",
          "type": "integer"
        },
        "oldBranchId": {
          "format": "int32",
          "type": "integer"
        },
        "newBranchId": {
          "format": "int32",
          "type": "integer"
        }
      }
    },
    "Invitation": {
      "type": "object",
      "properties": {
        "id": {
          "format": "int32",
          "type": "integer"
        },
        "token": {
          "format": "uuid",
          "type": "string"
        },
        "owner": {
          "$ref": "#/definitions/AccountSlim"
        },
        "organizationId": {
          "format": "int32",
          "type": "integer"
        },
        "account": {
          "$ref": "#/definitions/AccountSlim"
        },
        "position": {
          "$ref": "#/definitions/Position"
        },
        "messageBody": {
          "type": "string"
        },
        "invitedOn": {
          "format": "date-time",
          "type": "string"
        },
        "state": {
          "enum": [
            "Unsent",
            "NoResponse",
            "Confirmed",
            "Rejected"
          ],
          "type": "string"
        },
        "deleted": {
          "type": "boolean"
        }
      }
    },
    "Position": {
      "type": "object",
      "properties": {
        "id": {
          "format": "int32",
          "type": "integer"
        },
        "templateId": {
          "format": "int32",
          "type": "integer"
        },
        "name": {
          "type": "string"
        },
        "isOfficer": {
          "type": "boolean"
        },
        "holders": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/AccountSlim"
          }
        },
        "totalHolders": {
          "format": "int32",
          "type": "integer"
        },
        "organizationId": {
          "format": "int32",
          "type": "integer"
        },
        "typeId": {
          "format": "int32",
          "type": "integer"
        },
        "typeName": {
          "type": "string"
        }
      }
    },
    "MembershipRequest": {
      "type": "object",
      "properties": {
        "id": {
          "format": "int32",
          "type": "integer"
        },
        "institutionId": {
          "format": "int32",
          "type": "integer"
        },
        "organizationId": {
          "format": "int32",
          "type": "integer"
        },
        "positionId": {
          "format": "int32",
          "type": "integer"
        },
        "positionName": {
          "type": "string"
        },
        "membershipType": {
          "type": "string"
        },
        "startsOn": {
          "format": "date-time",
          "type": "string"
        },
        "endsOn": {
          "format": "date-time",
          "type": "string"
        },
        "requestedOn": {
          "format": "date-time",
          "type": "string"
        },
        "reflectionId": {
          "format": "int32",
          "type": "integer"
        },
        "deleted": {
          "type": "boolean"
        },
        "account": {
          "$ref": "#/definitions/AccountSlim"
        },
        "autoApproved": {
          "type": "boolean"
        }
      }
    },
    "PagedResult[Organization]": {
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
            "$ref": "#/definitions/Organization"
          }
        }
      }
    },
    "Organization": {
      "type": "object",
      "properties": {
        "id": {
          "format": "int32",
          "type": "integer"
        },
        "communityId": {
          "format": "int32",
          "type": "integer"
        },
        "institutionId": {
          "format": "int32",
          "type": "integer"
        },
        "name": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "nameSortKey": {
          "type": "string"
        },
        "websiteKey": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "summary": {
          "type": "string"
        },
        "status": {
          "type": "string"
        },
        "comment": {
          "type": "string"
        },
        "showJoin": {
          "type": "boolean"
        },
        "statusChangeDateTime": {
          "format": "date-time",
          "type": "string"
        },
        "startDate": {
          "format": "date-time",
          "type": "string"
        },
        "endDate": {
          "format": "date-time",
          "type": "string"
        },
        "parentId": {
          "format": "int32",
          "type": "integer"
        },
        "wallId": {
          "format": "int32",
          "type": "integer"
        },
        "discussionId": {
          "format": "int32",
          "type": "integer"
        },
        "groupTypeId": {
          "format": "int32",
          "type": "integer"
        },
        "organizationTypeId": {
          "format": "int32",
          "type": "integer"
        },
        "cssConfigurationId": {
          "format": "int32",
          "type": "integer"
        },
        "deleted": {
          "type": "boolean"
        },
        "enableGoogleCalendar": {
          "type": "boolean"
        },
        "modifiedOn": {
          "format": "date-time",
          "type": "string"
        },
        "socialMedia": {
          "type": "object",
          "properties": {
            "ExternalWebsite": {
              "type": "string"
            },
            "FacebookUrl": {
              "type": "string"
            },
            "FlickrUrl": {
              "type": "string"
            },
            "GoogleCalendarUrl": {
              "type": "string"
            },
            "GooglePlusUrl": {
              "type": "string"
            },
            "InstagramUrl": {
              "type": "string"
            },
            "LinkedInUrl": {
              "type": "string"
            },
            "PinterestUrl": {
              "type": "string"
            },
            "TumblrUrl": {
              "type": "string"
            },
            "TwitterUrl": {
              "type": "string"
            },
            "TwitterUserName": {
              "type": "string"
            },
            "VimeoUrl": {
              "type": "string"
            },
            "YoutubeUrl": {
              "type": "string"
            }
          }
        },
        "profilePicture": {
          "type": "string"
        },
        "organizationType": {
          "$ref": "#/definitions/OrganizationType"
        },
        "primaryContact": {
          "$ref": "#/definitions/AccountSlim"
        },
        "isBranch": {
          "type": "boolean"
        },
        "contactInfo": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/OrganizationContactInfo"
          }
        },
        "legacyKey": {
          "format": "int32",
          "type": "integer"
        },
        "parentLegacyKey": {
          "format": "int32",
          "type": "integer"
        },
        "legacyPrimaryContactKey": {
          "format": "int32",
          "type": "integer"
        },
        "showFacebookWall": {
          "type": "boolean"
        },
        "showTwitterFeed": {
          "type": "boolean"
        },
        "submissions": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/RegistrationSubmission"
          }
        },
        "visibility": {
          "enum": [
            "Public",
            "Institution",
            "Organization",
            "Private"
          ],
          "type": "string"
        }
      }
    },
    "PagedResult[PositionHolder]": {
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
            "$ref": "#/definitions/PositionHolder"
          }
        }
      }
    },
    "PositionHolder": {
      "type": "object",
      "properties": {
        "id": {
          "format": "int32",
          "type": "integer"
        },
        "templateId": {
          "format": "int32",
          "type": "integer"
        },
        "name": {
          "type": "string"
        },
        "isOfficer": {
          "type": "boolean"
        },
        "organizationId": {
          "format": "int32",
          "type": "integer"
        },
        "typeId": {
          "format": "int32",
          "type": "integer"
        },
        "typeName": {
          "type": "string"
        },
        "holder": {
          "$ref": "#/definitions/AccountSlim"
        }
      }
    }
  },
  "securityDefinitions": {

  }
}
