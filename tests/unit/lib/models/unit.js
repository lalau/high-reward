'use strict';

var expect = require('chai').expect;
var Unit = require('../../../../lib/models/unit');

describe('Unit', function () {
    it('should init with the key', function() {
        var unit = new Unit({key: 'infantry-1'});

        expect(unit.key).to.equal('infantry-1');
        expect(unit.type).to.equal('Infantry');
        expect(unit.attrs).to.eql({
            hp: 16,
            shoot: 8,
            defence: 8,
            trading: 0,
            performance: 0,
            building: 0,
            expert: 0,
            maxHp: 16,
            fatigue: 0
        });
    });

    it('should init with overriding attributes', function() {
        var attrs = {
            hp: 17,
            shoot: 9,
            defence: 9,
            trading: 1,
            performance: 1,
            building: 1,
            expert: 1,
            maxHp: 17,
            fatigue: 1
        };
        var unit = new Unit({key: 'infantry-1', attrs: attrs});

        expect(unit.key).to.equal('infantry-1');
        expect(unit.type).to.equal('Infantry');
        expect(unit.attrs).to.eql(attrs);
    });
});
