"use strict";

var And = require('./obj/and');
var Or = require('./obj/or');
var Not = require('./obj/not');
var Parameter = require('./obj/parameter');
var Query = require('./query');


var resolve = function(cl, ...args) {
    if (args.length == 0) {
        throw new Error('A binding operation like "and" and "or" ' +
            'must have at least one argument.');
    } else {
        let element = args[0];
        for(let i = 1; i < args.length; i++) {
            let other = args[i];
            element = new cl(element, other);
        }
        return element;
    }
};


var filterFor = function(filterName) {
    return function(name, value) {
        return binding.param(name, filterName, value);
    };
};


var binding = {
    and: function(...args) {
        return resolve(And, ...args);
    },
    or: function(...args) {
        return resolve(Or, ...args);
    },
    not: function(inner) {
        return new Not(inner);
    },
    param: function(name, filter, value) {
        let parameter = new Parameter(name);
        parameter.filter = filter;
        parameter.value = value;
        return parameter;
    },
    filters: function(obj) {
        obj = obj || {};
        let data = {};
        for(let key in obj) {
            data[key] = filterFor(obj[key]);
        }
        return data;
    },
    query: function() {
        return new Query();
    }
};

module.exports = binding;
