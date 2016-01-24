'use strict';

var expect = require('chai').expect;
var Commander = require('../../../../lib/models/commander');
var weapons =require('../../../../configs/weapons');
var protections =require('../../../../configs/protections');
var items =require('../../../../configs/items');
var baseAttrs = {
    hp: 30,
    shoot: 11,
    defence: 11,
    trading: 0,
    performance: 0,
    building: 0,
    expertRaw: 0,
    maxHp: 30,
    fatigue: 0
};

describe('Commander', function () {
    describe('init', function() {
        it('should init with the key', function() {
            var commander = new Commander({key: 'moro'});

            expect(commander.key).to.equal('moro');
            expect(commander.type).to.equal('commander');
            expect(commander.name).to.equal('Moro Dinando');
            expect(commander.shortName).to.equal('Moro');
            expect(commander.troopName).to.equal('Dinando 1st Squad');
            expect(commander.attrs).to.eql(baseAttrs);
            expect(commander.weapon).to.eql(weapons.lurefit);
            expect(commander.protection).to.eql(protections['copper-armor']);
        });

        it('should init with overriding attributes', function() {
            var attrs = {
                hp: 31,
                shoot: 12,
                defence: 12,
                trading: 1,
                performance: 1,
                building: 1,
                expertRaw: 1,
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
            expect(commander.weapon).to.eql(weapons.lurefit);
            expect(commander.protection).to.eql(protections['copper-armor']);
        });
    });

    describe('state', function() {
        it('should dehydrate and rehydrate', function() {
            var commander = new Commander({key: 'moro'});
            var dehydrated = commander.dehydrate();

            expect(dehydrated).to.eql({
                attrs: baseAttrs,
                unitConfig: {
                    items: [],
                    key: 'moro',
                    name: 'Moro Dinando',
                    protection: 'copper-armor',
                    shortName: 'Moro',
                    troopName: 'Dinando 1st Squad',
                    weapon: 'lurefit'
                }
            });

            expect(Commander.rehydrate(dehydrated)).to.eql(commander);
        });
    });

    describe('canHandle', function() {
        it('should return true/false for whether the commander can handle the items', function() {
            var commander = new Commander({key: 'moro'});

            expect(commander.canHandle('weapon', 'lurefit')).to.eql(true);
            expect(commander.canHandle('protection', 'copper-armor')).to.eql(true);
            expect(commander.canHandle('item', 'recovery-10')).to.eql(true);
        });
    });

    describe('updateExperts', function() {
        it('should set attrs computed by the expert and base attrs', function() {
            var commander = new Commander({key: 'moro'});

            expect(commander.attrs.hp).to.eql(30);
            expect(commander.attrs.maxHp).to.eql(30);
            expect(commander.attrs.shoot).to.eql(11);
            expect(commander.attrs.defence).to.eql(11);

            commander.attrs.expertRaw = 5000;
            commander.updateExperts();

            expect(commander.attrs.hp).to.eql(37);
            expect(commander.attrs.maxHp).to.eql(37);
            expect(commander.attrs.shoot).to.eql(13);
            expect(commander.attrs.defence).to.eql(13);

            commander.attrs.expertRaw = 99999;
            commander.updateExperts();

            expect(commander.attrs.hp).to.eql(342);
            expect(commander.attrs.maxHp).to.eql(342);
            expect(commander.attrs.shoot).to.eql(125);
            expect(commander.attrs.defence).to.eql(125);
        });
    });
});
