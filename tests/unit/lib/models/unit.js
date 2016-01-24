'use strict';

var expect = require('chai').expect;
var Unit = require('../../../../lib/models/unit');
var weapons =require('../../../../configs/weapons');
var protections =require('../../../../configs/protections');
var items =require('../../../../configs/items');
var baseAttrs = {
    hp: 16,
    shoot: 8,
    defence: 8,
    trading: 0,
    performance: 0,
    building: 2,
    expertRaw: 0,
    maxHp: 16,
    fatigue: 0
};

describe('Unit', function() {
    describe('init', function() {
        it('should init with key', function() {
            var unit = new Unit({key: 'infantry'});

            expect(unit.key).to.equal('infantry');
            expect(unit.name).to.equal('Infantry');
            expect(unit.attrs).to.eql(baseAttrs);
            expect(unit.type).to.eql('unit');
        });

        it('should init with preset', function() {
            var attrs = {
                hp: 20,
                shoot: 10,
                defence: 10,
                trading: 0,
                performance: 0,
                building: 2,
                expertRaw: 5000,
                maxHp: 20,
                fatigue: 0
            };
            var unit = new Unit({key: 'infantry', preset: 'a'});

            expect(unit.key).to.equal('infantry');
            expect(unit.name).to.equal('Infantry');
            expect(unit.attrs).to.eql(attrs);
            expect(unit.type).to.eql('unit');
        });

        it('should init with overriding attributes', function() {
            var attrs = {
                hp: 17,
                shoot: 9,
                defence: 9,
                trading: 1,
                performance: 1,
                building: 1,
                expertRaw: 1,
                maxHp: 17,
                fatigue: 1
            };
            var unit = new Unit({key: 'infantry', attrs: attrs});

            expect(unit.key).to.equal('infantry');
            expect(unit.name).to.equal('Infantry');
            expect(unit.attrs).to.eql(attrs);
            expect(unit.type).to.eql('unit');
        });

        it('should init carrying', function() {
            var unit = new Unit({key: 'infantry', unitConfig: {weapon: 'tima', protection: 'cloth-armor', items: ['recovery-10']}});

            expect(unit.weapon).to.eql(weapons.tima);
            expect(unit.protection).to.eql(protections['cloth-armor']);
            expect(unit.items[0]).to.eql(items['recovery-10']);
        });

        it('should init with empty items', function() {
            var unit = new Unit({key: 'infantry'});

            expect(unit.items).to.eql([]);
        });
    });

    describe('state', function() {
        it('should dehydrate and rehydrate', function() {
            var unit = new Unit({key: 'infantry', unitConfig: {weapon: 'tima', protection: 'cloth-armor', items: ['recovery-10']}});
            var dehydrated = unit.dehydrate();

            expect(dehydrated).to.eql({
                attrs: baseAttrs,
                unitConfig: {
                    items: ['recovery-10'],
                    key: 'infantry',
                    name: 'Infantry',
                    protection: 'cloth-armor',
                    weapon: 'tima'
                }
            });

            expect(Unit.rehydrate(dehydrated)).to.eql(unit);
        });
    });

    describe('getSellPrice', function() {
        it('should add up unit, weapon, protection and items price', function() {
            var unit = new Unit({key: 'infantry', unitConfig: {weapon: 'tima', protection: 'cloth-armor', items: ['recovery-10']}});

            expect(unit.getSellPrice()).to.eql(295);
        });
    });

    describe('updateItem', function() {
        it('should set weapon and protection', function() {
            var unit = new Unit({key: 'infantry', unitConfig: {weapon: 'tima', protection: 'cloth-armor'}});

            unit.updateItem('weapon', 'punav');
            unit.updateItem('protection', 'cloth-armor');
            expect(unit.weapon).to.eql(weapons.punav);
            expect(unit.protection).to.eql(protections['cloth-armor']);
        });

        it('should append items for same item type', function() {
            var unit = new Unit({key: 'infantry'});

            unit.updateItem('item', 'recovery-10');
            unit.updateItem('item', 'recovery-10');
            expect(unit.items).to.eql([items['recovery-10'], items['recovery-10']]);
        });

        it('should clear items for new item type', function() {
            var unit = new Unit({key: 'infantry', unitConfig: {items: ['recovery-10']}});

            unit.updateItem('item', 'recovery-20');
            expect(unit.items).to.eql([items['recovery-20']]);
        });
    });

    describe('canHandle', function() {
        it('should return true/false for whether the unit can handle the items', function() {
            var unit = new Unit({key: 'infantry'});

            expect(unit.canHandle('weapon', 'tima')).to.eql(true);
            expect(unit.canHandle('protection', 'heavy-iron-armor')).to.eql(false);
            expect(unit.canHandle('item', 'recovery-10')).to.eql(true);
        });
    });

    describe('getExpert', function() {
        it('should return normalized value of expert', function() {
            var unit = new Unit({key: 'infantry'});

            expect(unit.getExpert()).to.eql(0);
            unit.attrs.expertRaw = 5456;
            expect(unit.getExpert()).to.eql(54);
            unit.attrs.expertRaw = 999999;
            expect(unit.getExpert()).to.eql(999);
        });
    });

    describe('updateExperts', function() {
        it('should set attrs computed by the expert and base attrs', function() {
            var unit = new Unit({key: 'infantry'});

            expect(unit.attrs.hp).to.eql(16);
            expect(unit.attrs.maxHp).to.eql(16);
            expect(unit.attrs.shoot).to.eql(8);
            expect(unit.attrs.defence).to.eql(8);

            unit.attrs.expertRaw = 5000;
            unit.updateExperts();

            expect(unit.attrs.hp).to.eql(20);
            expect(unit.attrs.maxHp).to.eql(20);
            expect(unit.attrs.shoot).to.eql(10);
            expect(unit.attrs.defence).to.eql(10);

            unit.attrs.expertRaw = 99999;
            unit.updateExperts();

            expect(unit.attrs.hp).to.eql(36);
            expect(unit.attrs.maxHp).to.eql(36);
            expect(unit.attrs.shoot).to.eql(18);
            expect(unit.attrs.defence).to.eql(18);
        });
    });
});
