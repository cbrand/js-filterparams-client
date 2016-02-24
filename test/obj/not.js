var helpers = require('../helpers');
var Not = helpers.require('obj/not');
var expect = require('chai').expect;


describe('Not', function() {

    describe('constructor', function() {
        var not;

        beforeEach(function() {
            not = new Not('a');
        });

        it('should set theinner element', function() {
            expect(not.inner).to.equal('a');
        });

        it('should throw an error if a non existing parameter is ' +
            'passed to not', function() {
            expect(function() {
                new Not(null);
            }).to.throw(Error);
        });
    });

});
