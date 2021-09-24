/* global JSON */
var esanimate = module.exports;

esanimate.astify = function(obj, canonicalize) {
  var type = typeof obj;
  if (
    obj === null ||
    type === 'boolean' ||
    type === 'number' ||
    type === 'string' ||
    Object.prototype.toString.call(obj) === '[object RegExp]'
  ) {
    return { type: 'Literal', value: obj };
  } else if (type === 'undefined') {
    return { type: 'Identifier', name: 'undefined' };
  } else if (Array.isArray(obj)) {
    return {
      type: 'ArrayExpression',
      elements: obj.map(function(element) {
        return esanimate.astify(element, canonicalize);
      })
    };
  } else if (typeof obj === 'object') {
    var keys = Object.keys(obj);
    if (canonicalize) {
      keys = keys.sort();
    }
    return {
      type: 'ObjectExpression',
      properties: keys.map(function(key) {
        return {
          type: 'Property',
          kind: 'init',
          key: /^\w+$/.test(key)
            ? { type: 'Identifier', name: key }
            : { type: 'Literal', value: key },
          value: esanimate.astify(obj[key], canonicalize)
        };
      })
    };
  } else if (typeof obj === 'function') {
    var functionAst = require('esprima').parse(`!${obj.toString()}`).body[0]
      .expression.argument;
    if (typeof obj._name === 'string') {
      functionAst.id = { type: 'Identifier', name: obj._name };
    } else if (functionAst.id && functionAst.id.name === 'anonymous') {
      functionAst.id = null;
    }
    return functionAst;
  } else {
    throw new Error(`esanimate.astify: Cannot convert ${JSON.stringify(obj)}`);
  }
};

esanimate.objectify = function(ast) {
  if (ast.type === 'Literal') {
    return ast.value;
  } else if (ast.type === 'Identifier' && ast.name === 'undefined') {
    return undefined;
  } else if (ast.type === 'ObjectExpression') {
    // What about AST_ObjectGetter and AST_ObjectSetter?
    var obj = {};
    ast.properties.forEach(function(property) {
      if (
        property.key.type !== 'Identifier' &&
        property.key.type !== 'Literal'
      ) {
        throw new Error('Getters and setters are not supported yet.');
      }
      obj[property.key.name || property.key.value] = esanimate.objectify(
        property.value
      );
    });
    return obj;
  } else if (ast.type === 'ArrayExpression') {
    return ast.elements.map(esanimate.objectify);
  } else if (ast.type === 'FunctionExpression') {
    // eslint-disable-next-line no-new-func
    var fn = new Function(
      ast.params
        .map(function(param) {
          return param.name;
        })
        .join(','),
      require('escodegen').generate({ type: 'Program', body: ast.body.body })
    );
    if (ast.id) {
      fn._name = ast.id.name;
    }
    return fn;
  } else {
    throw new Error(
      `esanimate.objectify: Cannot convert ${JSON.stringify(ast)}`
    );
  }
};
