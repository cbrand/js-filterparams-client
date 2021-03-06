"use strict";

class Order {

    constructor(name, desc) {
        this.name = name;
        this.desc = desc || false;
    }

    toString() {
        var func = 'asc';
        if(this.desc) {
            func = 'desc';
        }

        return func + '(' + this.name + ')';
    }

}

module.exports = Order;
