"use strict";

class Parameter {

    constructor(name) {
        this.name = name;
        this.filter = null;
        this.alias = null;
        this.value = null;
    }

    get key() {
        var key = 'filter[param][' + this.name + ']';
        if(this.filter) {
            key += '[' + this.filter + ']';

            if(this.alias) {
                key += '[' + this.alias + ']';
            }
        }

        return key;
    }

}

module.exports = Parameter;
