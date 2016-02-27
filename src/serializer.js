"use strict";

var Parameter = require('./obj/parameter');
var _LeftRight = require('./obj/_left_right');
var And = require('./obj/and');
var Or = require('./obj/or');
var Not = require('./obj/not');


var parenthesizeIfNecessary = function(value) {
    if(/[!&\|]+/.test(value)) {
        value = '(' + value + ')';
    }
    return value;
};


class Serializer {

    constructor() {
        this.seenParams = [];
        this.seenAliases = [];
        this.binding = null;
    }

    unusedAlias(aliasName) {
        var index = 1;
        while(this.seenAliases.indexOf(aliasName + index) !== -1) {
            index++;
        }
        return aliasName + index;
    }

    verifyParameter(parameter) {
        if(this.seenParams.indexOf(parameter) === -1) {
            if(parameter.alias) {
                if(this.seenAliases.indexOf(parameter.alias) !== -1) {
                    parameter.alias = this.unusedAlias(parameter.alias);
                }
                this.seenAliases.push(parameter.alias);
            } else {
                if(this.seenAliases.indexOf(parameter.name) !== -1) {
                    parameter.alias = this.unusedAlias(parameter.name);
                    this.seenAliases.push(parameter.alias);
                } else {
                    this.seenAliases.push(parameter.name);
                }
            }

            this.seenParams.push(parameter);
        }
    }

    process(data) {
        this.binding = this._process(data);
        return this.data;
    }

    _process(data) {
        let binding;

        if(data instanceof Parameter) {
            this.verifyParameter(data);
            if(!data.alias) {
                binding = data.name;
            } else {
                binding = data.alias;
            }
        } else if(data instanceof _LeftRight) {
            let left = parenthesizeIfNecessary(
                this._process(data.args[0]));
            let right = parenthesizeIfNecessary(
                this._process(data.args[1]));
            let symbol = null;

            if(data instanceof And) {
                symbol = '&';
            } else if(data instanceof Or) {
                symbol = '|';
            } else {
                throw new Error('Unknown element ' + data);
            }

            binding = left + symbol + right;
        } else if(data instanceof Not) {
            binding = '!' + parenthesizeIfNecessary(
                    this._process(data.inner));
        } else if(data) {
            throw new Error('Unkown element ' + data);
        }

        return binding || null;
    }

    get data() {
        let result = {};
        if(this.binding){
            result['filter[binding]'] = this.binding;
        }

        this.seenParams.forEach(function(parameter) {
            result[parameter.key] = parameter.value;
        });

        return result;
    }
}


var serializeBinding = function(data) {
    let serializer = new Serializer();
    return serializer.process(data);
};


var serializeOrder = function(orders) {
    let orderResponse = {};
    let orderArray = [];

    orders.forEach(function(order) {
        orderArray.push(order.toString());
    });

    if(orderArray.length > 0) {
        orderResponse['filter[order]'] = orderArray;
    }

    return orderResponse;
};


module.exports = function(query) {
    let resp = serializeBinding(query.applied_filter);

    let orders = serializeOrder(query.orders);
    for(let key in orders) {
        resp[key] = orders[key];
    }

    return resp;
};
