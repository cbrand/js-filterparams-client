var helpers = require('./helpers');
var api = helpers.require('api');
var serialize = helpers.require('serializer');
var LeftRight = helpers.require('obj/_left_right');
var expect = require('chai').expect;


describe('#serialize', function() {

    var query;
    var filters;

    var serializeQuery = function() {
        return serialize(query);
    };

    beforeEach(function() {
        query = api.query();
        filters = api.filters({
            'equals': 'eq',
            'greater': 'gt',
            'lesser': 'lt',
            'like': 'like'
        });
    });

    it('should return an empty object if an empty query is serialized', function() {
        expect(serialize(query)).to.deep.equal({});
    });

    it('should create serialize a filter', function() {
        let param = filters.equals('name', 'user');
        let serializedExpectation = {
            'filter[binding]': param.name
        };
        serializedExpectation[param.key] = param.value;

        query = query.filter(param);

        expect(serializeQuery()).to.deep.equal(serializedExpectation);
    });

    describe('filter binding generation', function() {

        var param;
        var otherParam;

        beforeEach(function() {
            param = filters.equals('name', 'user');
            otherParam = filters.equals('birthDate', '1970-01-01');
        });

        var serializedBinding = function() {
            let serialized = serializeQuery();
            return serialized['filter[binding]'];
        };

        describe('left right combinations', function() {

            it('should create correct bindings for an and filter', function() {
                query = query.filter(api.and(param, otherParam));
                expect(serializedBinding()).to.equal('name&birthDate');
            });

            it('should create correct bindings for an or filter', function() {
                query = query.filter(api.or(param, otherParam));
                expect(serializedBinding()).to.equal('name|birthDate');
            });

            it('should create correct bindings for an or and combination', function() {
                query = query.filter(api.or(param, api.and(param, otherParam)));
                expect(serializedBinding()).to.equal('name|(name&birthDate)');
            });

        });

        describe('negation', function() {

            it('should create the correct bindings for a basic negation', function() {
                query = query.filter(api.not(param));

                expect(serializedBinding()).to.equal('!name');
            });

            it('should create the correct bindings for nested negations', function() {
                query = query.filter(api.not(api.not(param)));

                expect(serializedBinding()).to.equal('!(!name)');
            });

            it('should create the correct bindings for negated combinations', function() {
                query = query.filter(api.not(api.and(param, otherParam)));
                expect(serializedBinding()).to.equal('!(name&birthDate)');
            });

        });

    });

    describe('name conflict handling', function() {
        var param;
        var paramWithSameName;

        beforeEach(function() {
            param = filters.equals('name', 'thisName');
            paramWithSameName = filters.equals('name', 'otherName');

            query = query.filter(api.or(param, paramWithSameName));
        });

        it('should automatically set aliases for params with clashing names', function() {
            var result = serializeQuery();

            expect(result).to.have.all.keys('filter[binding]', param.key, paramWithSameName.key);
            expect(paramWithSameName.alias).to.not.be.null;
        });

        it('should automatically resolve alias name clashes', function() {
            param.alias = 'someName';
            paramWithSameName.alias = 'someName';

            var result = serializeQuery();

            expect(result).to.have.all.keys('filter[binding]', param.key, paramWithSameName.key);
            expect(paramWithSameName.alias).to.not.equal('someName');
        });
    });

    describe('unkown parameters', function() {

        it('should raise an error if an unkown parameter is passed', function() {
            query = query.filter('abc');
            expect(serializeQuery).to.throw(Error);
        });

        it('should raise an error on unkown _LeftRight objects', function() {
            query = query.filter(new LeftRight(
                filters.equals('name', 'test'),
                filters.equals('otherName', 'otherTest')
            ));

            expect(serializeQuery).to.throw(Error);
        });

    });

});
