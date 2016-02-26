var helpers = require('../helpers');
var Order = helpers.require('obj/order');
var expect = require('chai').expect;


describe('Order', function() {

    describe('constructor', function() {
        var order;

        beforeEach(function() {
            order = new Order('a');
        });

        it('should set the order', function() {
           expect(order.name).to.equal('a');
        });

        it('should set the entry of not descending', function() {
            expect(order.desc).to.not.be.ok;
        });

        it('should set the entry to descending if configured', function() {
            order = new Order('a', true);
            expect(order.desc).to.be.ok;
        });

    });

    describe('#toString', function() {
        var order;

        beforeEach(function() {
            order = new Order('a');
        });

        it('should correctly set the order to ascending order', function() {
            expect(order.toString()).to.eq('asc(a)');
        });

        it('should stringify the order to descending order when configured', function() {
           order = new Order('name', true);
            expect(order.toString()).to.eq('desc(name)');
        });

    });

});
