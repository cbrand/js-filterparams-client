var helpers = require('../helpers');
var Or = helpers.require('obj/or');
var expect = require('chai').expect;


describe('Or', function() {

    describe('constructor', function() {
        var or;

        beforeEach(function() {
            or = new Or('a', 'b');
        });

        it('should take a left and right entry', function() {
            expect(or.args).to.deep.equal(['a', 'b']);
        });

    });

});
