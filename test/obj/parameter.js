var helpers = require('../helpers');
var Parameter = helpers.require('obj/parameter');
var expect = require('chai').expect;

describe('Parameter', function() {

    describe('constructor', function() {

        var parameter;

        beforeEach(function() {
            parameter = new Parameter('paramName');
        });

        it('should set a name to the parameter', function() {
            expect(parameter.name).to.eq('paramName');
        });

    });

});
