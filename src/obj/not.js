"use strict";

class Not {
    constructor(inner) {
        if(!inner) {
            throw new Error(
                'The inner argument is not must be present.'
            );
        }
        this.inner = inner;
    }
}

module.exports = Not;
