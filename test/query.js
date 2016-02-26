var helpers = require('./helpers');
var Query = helpers.require('query');
var Parameter = helpers.require('obj/parameter');
var And = helpers.require('obj/and');
var expect = require('chai').expect;


describe('Query', function() {

    var query;

    beforeEach(function() {
        query = new Query();
    });

    describe('#constructor', function() {

        it('should initialize the query with an empty filter', function() {
            expect(query.applied_filter).to.be.null;
        });

        it('should initialize an empty array with the given parsers', function() {
            expect(query.orders).to.deep.equal([]);
        });

    });

    describe('#clone', function() {

        it('should return another query object', function() {
           expect(query.clone()).to.not.eq(query);
        });

    });

    describe('#filter', function() {

        var parameter;

        beforeEach(function() {
            parameter = new Parameter('name');
            parameter.filter = 'eq';
            parameter.value = 'test';
        });

        it('should return the same object if the filter function is ' +
            'called without an argument.', function() {
            expect(query.filter()).to.eq(query);
        });

        it('should return a new query object if a filter is added ' +
            'with an parameter', function() {
            expect(query.filter(parameter)).to.not.eq(query);
        });

        describe('when adding a new parameter to the filter', function() {

            beforeEach(function() {
                query = query.filter(parameter);
            });

            it('should set the parameter as the applied filter',
                function() {
                expect(query.applied_filter).to.eq(parameter);
            });

            describe('when adding another parameter', function() {
                var otherParameter;

                beforeEach(function() {
                    otherParameter = new Parameter('otherName');
                    query = query.filter(otherParameter);
                });

                it('should combine the parameters with an AND ' +
                    'combination', function() {
                    expect(query.applied_filter).to.be.an.instanceof(And);
                });

                it('should set the left entry of the AND with an parameter', function() {
                    expect(query.applied_filter.args[0]).to.equal(parameter);
                });

                it('should set the right entry of the AND with the other parameter', function() {
                    expect(query.applied_filter.args[1]).to.equal(otherParameter);
                });
            });
        });

    });

    describe('#order', function() {

        it('should return the same query if order is called without arguments', function() {
            expect(query.order()).to.eq(query);
        });

        it('should return a new object if an order is applied', function() {
            expect(query.order('test')).to.not.eq(query);
        });

        describe('when an order is applied', function() {

            beforeEach(function() {
                query = query.order('name');
            });

            it('should add a new order entry', function() {
                expect(query.orders.length).to.equal(1);
            });

            it('should set the correct name to the order', function() {
                expect(query.orders[0].name).to.equal('name');
            });

            it('should set the direction to ascending if no param is provided', function() {
                expect(query.orders[0].desc).to.be.false;
            });

            describe('if another order is applied', function() {

                beforeEach(function() {
                    query = query.order('otherName', true);
                });

                it('should set the correct amount of order entries', function() {
                    expect(query.orders.length).to.equal(2);
                });

                it('should set the correct name of the second order', function() {
                    expect(query.orders[1].name).to.equal('otherName');
                });

                it('should set the correct sorting direction', function() {
                    expect(query.orders[1].desc).to.equal(true);
                });

            });

        });

    });

});
