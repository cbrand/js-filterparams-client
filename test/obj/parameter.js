var helpers = require('../helpers');
var Parameter = helpers.require('obj/parameter');
var expect = require('chai').expect;

describe('Parameter', function() {

    var parameter;

    beforeEach(function() {
        parameter = new Parameter('paramName');
    });

    describe('constructor', function() {

        it('should set a name to the parameter', function() {
            expect(parameter.name).to.eq('paramName');
        });

    });

    describe('#key', function() {

        it('should correctly create a key without a filter and an alias', function() {
            expect(parameter.key).to.equal('filter[param][paramName]');
        });

        it('should correctly create a key with a filter and not alias', function() {
            parameter.filter = 'eq';
            expect(parameter.key).to.equal('filter[param][paramName][eq]');
        });

        it('should ignore an alias if no filter is provided', function() {
            parameter.alias = 'aliasName';
            expect(parameter.key).to.equal('filter[param][paramName]');
        });

        it('should correctly create the key with an provided filter and alias', function() {
            parameter.alias = 'aliasName';
            parameter.filter = 'eq';
            expect(parameter.key).to.equal('filter[param][paramName][eq][aliasName]');
        });

    })

});
