// Thanks to https://github.com/amir-s/graphql-distributed-schema/blob/master/graph.js

const ql = require('graphql');

export default class {
  constructor() {
    this.rawTypes = {};
    this.createType('query', {
      name: 'Query',
      fields: () => {},
    });
  }

  clear() {
    this.rawTypes = {};
    this.createType('query', {
      name: 'Query',
      fields: () => {},
    });
  }

  createType(name, obj) {
    if (this.rawTypes[name]) throw new Error(`Type '${name}' already exists.`);
    return (this.rawTypes[name] = {
      from: obj.from || ql.GraphQLObjectType,
      name: obj.name,
      description: obj.description,
      args: obj.args,
      fields: [obj.fields],
      extend: fields =>
        this.rawTypes[name].fields.push(
          fields instanceof Function ? fields : () => fields
        ),
    });
  }

  type(name, obj) {
    if (obj === undefined) {
      if (this.rawTypes[name] === undefined)
        throw new Error(`Type '${name}' does not exist.`);
      return this.rawTypes[name];
    }
    return this.createType(name, obj);
  }

  generate() {
    let fnFromArray = fns => () =>
      fns.reduce((obj, fn) => Object.assign({}, obj, fn.call()), {});

    for (let key in this.rawTypes) {
      let item = this.rawTypes[key];
      this.rawTypes[key] = new item.from({
        name: item.name,
        description: item.description,
        args: item.args,
        fields: fnFromArray(item.fields),
      });
    }
    let schema = new ql.GraphQLSchema({
      query: this.type('query'),
      types: Object.values(this.rawTypes)
    });
    return schema;
  }
}
