"use strict";

var And = require('./obj/and');
var Order = require('./obj/order');


class Query {

    constructor() {
        this.applied_filter = null;
        this.orders = [];
    }

    clone() {
        var query = new Query();
        query.applied_filter = this.applied_filter;
        query.orders.push(...this.orders);
        return query;
    }

    filter(filterObj) {
        if(!filterObj) {
            return this;
        }
        var query = this.clone();
        if (query.applied_filter) {
            query.applied_filter = new And(
                query.applied_filter,
                filterObj);
        } else {
            query.applied_filter = filterObj;
        }
        return query;
    }

    order(name, desc) {
        if(!name) {
            return this;
        }
        var query = this.clone();
        query.orders.push(new Order(name, desc));
        return query;
    }

}


module.exports = Query;
