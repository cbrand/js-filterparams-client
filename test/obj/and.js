var helpers = require('../helpers');
var And = helpers.require('obj/and');
var expect = require('chai').expect;


describe('And', function() {

    describe('constructor', function() {
        var and;

        beforeEach(function() {
            and = new And('a', 'b');
        });

        it('should take a left and right entry', function() {
            expect(and.args).to.deep.equal(['a', 'b']);
        });

    });

});
