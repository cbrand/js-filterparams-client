var helpers = require('./helpers');
var api = helpers.require('api');
var Query = helpers.require('query');
var And = helpers.require('obj/and');
var Or = helpers.require('obj/or');
var Not = helpers.require('obj/not');
var Parameter = helpers.require('obj/parameter');
var expect = require('chai').expect;


describe('Api', function() {

    describe('#query', function() {

        it('should return a query object', function() {
            expect(api.query()).to.be.an.instanceOf(Query);
        });

    });

    describe('#filters', function() {
        var filters;

        beforeEach(function() {
            filters = api.filters({
                'equals': 'eq',
                'greater': 'gt'
            });
        });

        it('should create an filter object', function() {
            expect(filters).to.have.all.keys('equals', 'greater');
        });

        it('should create an empty object if no parameters are passed', function() {
            filters = api.filters();
            expect(filters).to.deep.equal({});
        });

        describe('when calling a created filter function', function() {
            var parameter;

            beforeEach(function() {
                parameter = filters.equals('name', 'user');
            });

            it('should create a parameter', function() {
                expect(parameter).to.be.an.instanceOf(Parameter);
            });

            it('should set the name of the parameter', function() {
                expect(parameter.name).to.equal('name');
            });

            it('should set the filter of the parameter', function() {
                expect(parameter.filter).to.equal('eq');
            });

            it('should set the value of the parameter', function() {
                expect(parameter.value).to.equal('user');
            });

        });

    });

    describe('#param', function() {
        var parameter;

        beforeEach(function() {
            parameter = api.param('name', 'eq', 'user');
        });

        it('should create a parameter', function() {
            expect(parameter).to.be.an.instanceOf(Parameter);
        });

        it('should set the name of the parameter', function() {
            expect(parameter.name).to.equal('name');
        });

        it('should set the filter of the parameter', function() {
            expect(parameter.filter).to.equal('eq');
        });

        it('should set the value of the parameter', function() {
            expect(parameter.value).to.equal('user');
        });

    });


    var createParam = function(name) {
        return api.param(name, 'eq', 'test');
    };

    describe('#and', function() {
        var and;

        describe('when adding no parameter', function() {

            it('should raise an error', function() {
                expect(function() {
                    api.and();
                }).to.throw(Error);
            });

        });

        describe('when adding two parameters', function() {
            beforeEach(function() {
                and = api.and(createParam('name'), createParam('birthDate'));
            });

            it('should create an and instance', function() {
                expect(and).to.be.an.instanceOf(And);
            });

            it('should set the parameter to the left side', function() {
                expect(and.args[0]).to.be.an.instanceOf(Parameter);
                expect(and.args[0].name).to.equal('name');
            });

            it('should set the parameter to the right side', function() {
                expect(and.args[1]).to.be.an.instanceOf(Parameter);
                expect(and.args[1].name).to.equal('birthDate');
            });
        });

        describe('when adding three parameters', function() {
            beforeEach(function() {
                and = api.and(
                    createParam('name'),
                    createParam('birthDate'),
                    createParam('other'));
            });

            it('should create an and instance', function() {
                expect(and).to.be.an.instanceOf(And);
            });

            it('should set a nested and parameter to the left side', function() {
                expect(and.args[0]).to.be.an.instanceOf(And);
                expect(and.args[0].args.length).to.equal(2);
            });

            it('should set the parameter to the right side', function() {
                expect(and.args[1]).to.be.an.instanceOf(Parameter);
                expect(and.args[1].name).to.equal('other');
            });
        });

    });

    describe('#or', function() {
        var or;

        describe('when adding no parameter', function() {

            it('should raise an error', function() {
                expect(function() {
                    api.or();
                }).to.throw(Error);
            });

        });

        describe('when adding two parameters', function() {
            beforeEach(function() {
                or = api.or(createParam('name'), createParam('birthDate'));
            });

            it('should create an or instance', function() {
                expect(or).to.be.an.instanceOf(Or);
            });

            it('should set the parameter to the left side', function() {
                expect(or.args[0]).to.be.an.instanceOf(Parameter);
                expect(or.args[0].name).to.equal('name');
            });

            it('should set the parameter to the right side', function() {
                expect(or.args[1]).to.be.an.instanceOf(Parameter);
                expect(or.args[1].name).to.equal('birthDate');
            });
        });

        describe('when adding three parameters', function() {
            beforeEach(function() {
                or = api.or(
                    createParam('name'),
                    createParam('birthDate'),
                    createParam('other'));
            });

            it('should create an or instance', function() {
                expect(or).to.be.an.instanceOf(Or);
            });

            it('should set a nested and parameter to the left side', function() {
                expect(or.args[0]).to.be.an.instanceOf(Or);
                expect(or.args[0].args.length).to.equal(2);
            });

            it('should set the parameter to the right side', function() {
                expect(or.args[1]).to.be.an.instanceOf(Parameter);
                expect(or.args[1].name).to.equal('other');
            });
        });

    });

    describe('#not', function() {
        var not;
        var parameter;

        beforeEach(function() {
            parameter = createParam('name');
            not = api.not(parameter);
        });

        it('should create an instance of Not', function() {
            expect(not).to.be.an.instanceOf(Not);
        });

        it('should set the inner value to the passed parameter', function() {
            expect(not.inner).to.equal(parameter);
        });

        it('should raise an error if no parameter is passed', function() {
            expect(function() {
                api.not()
            }).to.throw(Error);
        });
    });

});
