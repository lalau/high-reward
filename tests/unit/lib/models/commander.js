'use strict';

var expect = require('chai').expect;
var Commander = require('../../../../lib/models/commander');

describe('Commander', function () {
    it('should init with the key', function() {
        var commander = new Commander({key: 'moro'});

        expect(commander.key).to.equal('moro');
        expect(commander.type).to.equal('commander');
        expect(commander.name).to.equal('Moro Dinando');
        expect(commander.shortName).to.equal('Moro');
        expect(commander.troopName).to.equal('Dinando 1st Squad');
        expect(commander.attrs).to.eql({
            hp: 30,
            shoot: 11,
            defence: 11,
            trading: 0,
            performance: 0,
            building: 0,
            expert: 0,
            maxHp: 30,
            fatigue: 0
        });
    });

    it('should init with overriding attributes', function() {
        var attrs = {
            hp: 31,
            shoot: 12,
            defence: 12,
            trading: 1,
            performance: 1,
            building: 1,
            expert: 1,
            maxHp: 31,
            fatigue: 1
        };
        var commander = new Commander({key: 'moro', attrs: attrs});


        expect(commander.key).to.equal('moro');
        expect(commander.type).to.equal('commander');
        expect(commander.name).to.equal('Moro Dinando');
        expect(commander.shortName).to.equal('Moro');
        expect(commander.troopName).to.equal('Dinando 1st Squad');
        expect(commander.attrs).to.eql(attrs);
    });
});
