'use strict';

var expect = require('chai').expect;
var Troop = require('../../../../lib/models/troop');
var Commander = require('../../../../lib/models/commander');
var Unit = require('../../../../lib/models/unit');
var weapons =require('../../../../configs/weapons');
var protections =require('../../../../configs/protections');
var items =require('../../../../configs/items');
var _ = {
    fill: require('lodash/array/fill')
};
var baseCommadnerAttrs = {
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
var baseUnitAttrs = {
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

describe('Troop', function () {
    var members;
    var formation;

    beforeEach(function() {
        members = [];
        members.length = 11;
        _.fill(members, undefined);

        formation = [];
        formation.length = 11;
        _.fill(formation, undefined);
    });

    describe('init', function() {
        it('should init with commander only', function() {
            var commander = new Commander({key: 'moro'});
            var troop = new Troop({unit: commander});

            members[0] = commander;
            formation[0] = 0;

            expect(troop.commander).to.eql(commander);
            expect(troop.members).to.eql(members);
            expect(troop.formation).to.eql(formation);
            expect(troop.getName()).to.eql('Dinando 1st Squad');
        });

        it('should init with members only', function() {
            var unit = new Unit({key: 'infantry'});
            var troop = new Troop(null, [{unit: unit}]);

            members[0] = unit;
            formation[0] = 0;

            expect(troop.commander).to.eql(null);
            expect(troop.members).to.eql(members);
            expect(troop.formation).to.eql(formation);
            expect(troop.getName()).to.eql('');
        });

        it('should init with commander and members', function() {
            var commander = new Commander({key: 'moro'});
            var unit1 = new Unit({key: 'infantry'});
            var unit2 = new Unit({key: 'infantry', preset: 'a'});
            var troop = new Troop({unit: commander}, [{unit: unit1}, {unit: unit2}]);

            members[0] = commander;
            members[1] = unit1;
            members[2] = unit2;
            formation[0] = 0;
            formation[1] = 1;
            formation[2] = 2;

            expect(troop.commander).to.eql(commander);
            expect(troop.members).to.eql(members);
            expect(troop.formation).to.eql(formation);
            expect(troop.getName()).to.eql('Dinando 1st Squad');
        });

        it('should init with default config', function() {
            var troop = new Troop();

            expect(troop.order).to.eql(Troop.Order.STAY);
            expect(troop.move).to.eql(Troop.Move.ON_FOOT);
            expect(troop.tactic).to.eql(Troop.Tactic.NORMAL);
            expect(troop.formationIndex).to.eql(0);
            expect(troop.isRetreating).to.eql(false);
            expect(troop.poi).to.eql(undefined);
            expect(troop.lastPoi).to.eql(undefined);
            expect(troop.movements).to.eql(undefined);
            expect(troop.peacefulRounds).to.eql(0);
        });

        it('should init with overwriting config', function() {
            var troop = new Troop(null, null, {
                order: Troop.Order.RETREAT,
                move: Troop.Move.VEHICLE,
                tactic: Troop.Tactic.SCOUT,
                formationIndex: 1,
                isRetreating: true,
                poi: 2,
                lastPoi: 3,
                movements: 4,
                peacefulRounds: 5
            });

            expect(troop.order).to.eql(Troop.Order.RETREAT);
            expect(troop.move).to.eql(Troop.Move.VEHICLE);
            expect(troop.tactic).to.eql(Troop.Tactic.SCOUT);
            expect(troop.formationIndex).to.eql(1);
            expect(troop.isRetreating).to.eql(true);
            expect(troop.poi).to.eql(2);
            expect(troop.lastPoi).to.eql(3);
            expect(troop.movements).to.eql(4);
            expect(troop.peacefulRounds).to.eql(5);
        });
    });

    describe('state', function() {
        it('should dehydrate and rehydrate commander only troop', function() {
            var commander = new Commander({key: 'moro'});
            var troop = new Troop({unit: commander});
            var dehydrated = troop.dehydrate();

            expect(dehydrated.commander).to.eql({ unit: commander.dehydrate(), slotIndex: 0 });
            expect(dehydrated.members).to.eql(members);
            expect(Troop.rehydrate(dehydrated)).to.eql(troop);
        });

        it('should dehydrate and rehydrate unit only troop', function() {
            var unit = new Unit({key: 'infantry'});
            var troop = new Troop(null, [{unit: unit}]);
            var dehydrated = troop.dehydrate();

            members[0] = {unit: unit.dehydrate(), memberIndex: 0, slotIndex: 0};

            expect(dehydrated.commander).to.eql(null);
            expect(dehydrated.members).to.eql(members);
            expect(Troop.rehydrate(dehydrated)).to.eql(troop);
        });

        it('should dehydrate and rehydrate troop', function() {
            var commander = new Commander({key: 'moro'});
            var unit1 = new Unit({key: 'infantry'});
            var unit2 = new Unit({key: 'infantry', preset: 'a'});
            var troop = new Troop({unit: commander}, [{unit: unit1}, {unit: unit2}]);
            var dehydrated = troop.dehydrate();

            members[1] = {unit: unit1.dehydrate(), memberIndex: 1, slotIndex: 1};
            members[2] = {unit: unit2.dehydrate(), memberIndex: 2, slotIndex: 2};

            expect(dehydrated.commander).to.eql({ unit: commander.dehydrate(), slotIndex: 0 });
            expect(dehydrated.members).to.eql(members);
            expect(Troop.rehydrate(dehydrated)).to.eql(troop);
        });
    });

    describe('members', function() {
        it('should add members to the next available spot if positions are not specified', function() {
            var troop = new Troop();
            var units = [new Unit({key: 'infantry'}), new Unit({key: 'armoured-infantry'}), new Unit({key: 'mechanized-infantry'})];

            units.forEach(function(unit, index) {
                troop.addMember(unit);
                members[index] = unit;
                formation[index] = index;
                expect(troop.members).to.eql(members);
                expect(troop.formation).to.eql(formation);
            });
        });

        it('should add members to the specified spot but avoid collisions', function() {
            var troop = new Troop();
            var units = [new Unit({key: 'infantry'}), new Unit({key: 'armoured-infantry'}), new Unit({key: 'mechanized-infantry'})];
            var newUnits = [{
                unit: new Unit({key: 'infantry', preset: 'a'}),
                memberIndex: 1,
                slotIndex: 7,
                resolvedMemberIndex: 3,
                resolvedSlotIndex: 7
            }, {
                unit: new Unit({key: 'armoured-infantry', preset: 'a'}),
                memberIndex: 3,
                slotIndex: 2,
                resolvedMemberIndex: 4,
                resolvedSlotIndex: 3
            }, {
                unit: new Unit({key: 'mechanized-infantry', preset: 'a'}),
                memberIndex: 7,
                slotIndex: 7,
                resolvedMemberIndex: 7,
                resolvedSlotIndex: 4
            }];

            units.forEach(function(unit, index) {
                troop.addMember(unit);
                members[index] = unit;
                formation[index] = index;
            });

            newUnits.forEach(function(newUnitInfo, index) {
                troop.addMember(newUnitInfo.unit, newUnitInfo.memberIndex, newUnitInfo.slotIndex);
                members[newUnitInfo.resolvedMemberIndex] = newUnitInfo.unit;
                formation[newUnitInfo.resolvedSlotIndex] = newUnitInfo.resolvedMemberIndex;
                expect(troop.members).to.eql(members);
                expect(troop.formation).to.eql(formation);
            });
        });

        it('should remove members from the list and formation', function() {
            var commander = new Commander({key: 'moro'});
            var unit1 = new Unit({key: 'infantry'});
            var unit2 = new Unit({key: 'infantry', preset: 'a'});
            var unit3 = new Unit({key: 'infantry', preset: 'b'});
            var troop = new Troop({unit: commander}, [{unit: unit1}, {unit: unit2}, {unit: unit3}]);

            troop.removeMember(2);
            members[0] = commander;
            members[1] = unit1;
            members[3] = unit3;
            formation[0] = 0;
            formation[1] = 1;
            formation[3] = 3;

            expect(troop.members).to.eql(members);
            expect(troop.formation).to.eql(formation);
        });

        it('should replace member in the list but keep the formation intact', function() {
            var commander = new Commander({key: 'moro'});
            var unit1 = new Unit({key: 'infantry'});
            var unit2 = new Unit({key: 'infantry', preset: 'a'});
            var unit3 = new Unit({key: 'infantry', preset: 'b'});
            var unit4 = new Unit({key: 'armoured-infantry'});
            var troop = new Troop({unit: commander}, [{unit: unit1}, {unit: unit2}, {unit: unit3}]);

            troop.replaceMember(2, unit4);
            members[0] = commander;
            members[1] = unit1;
            members[2] = unit4;
            members[3] = unit3;
            formation[0] = 0;
            formation[1] = 1;
            formation[2] = 2;
            formation[3] = 3;

            expect(troop.members).to.eql(members);
            expect(troop.formation).to.eql(formation);
        });

        it('should swap member in the formation but keep the list intact', function() {
            var commander = new Commander({key: 'moro'});
            var unit1 = new Unit({key: 'infantry'});
            var unit2 = new Unit({key: 'infantry', preset: 'a'});
            var unit3 = new Unit({key: 'infantry', preset: 'b'});
            var troop = new Troop({unit: commander}, [{unit: unit1}, {unit: unit2}, {unit: unit3}]);

            troop.swapSlot(2, 3);
            members[0] = commander;
            members[1] = unit1;
            members[2] = unit2;
            members[3] = unit3;
            formation[0] = 0;
            formation[1] = 1;
            formation[2] = 3;
            formation[3] = 2;

            expect(troop.members).to.eql(members);
            expect(troop.formation).to.eql(formation);
        });
    });

    describe('items', function() {
        it('should swap weapons if only one has weapon', function() {
            var commander = new Commander({key: 'moro'});
            var unit1 = new Unit({key: 'mechanized-infantry'});
            var troop = new Troop({unit: commander}, [{unit: unit1}]);

            troop.swapItem(0, 1, 'weapon');
            members[0] = commander;
            members[1] = unit1;
            formation[0] = 0;
            formation[1] = 1;

            expect(troop.members).to.eql(members);
            expect(troop.formation).to.eql(formation);
            expect(commander.weapon).to.be.undefined;
            expect(unit1.weapon.key).to.eql('lurefit');
        });

        it('should swap weapons if both have weapons', function() {
            var commander = new Commander({key: 'moro'});
            var unit1 = new Unit({key: 'mechanized-infantry', unitConfig: {weapon: 'tima'}});
            var troop = new Troop({unit: commander}, [{unit: unit1}]);

            troop.swapItem(0, 1, 'weapon');
            members[0] = commander;
            members[1] = unit1;
            formation[0] = 0;
            formation[1] = 1;

            expect(troop.members).to.eql(members);
            expect(troop.formation).to.eql(formation);
            expect(commander.weapon.key).to.eql('tima');
            expect(unit1.weapon.key).to.eql('lurefit');
        });

        it('should not swap weapons if one of them can not handle the weapon', function() {
            var commander = new Commander({key: 'moro'});
            var unit1 = new Unit({key: 'infantry'});
            var troop = new Troop({unit: commander}, [{unit: unit1}]);

            troop.swapItem(0, 1, 'weapon');
            members[0] = commander;
            members[1] = unit1;
            formation[0] = 0;
            formation[1] = 1;

            expect(troop.members).to.eql(members);
            expect(troop.formation).to.eql(formation);
            expect(commander.weapon.key).to.eql('lurefit');
            expect(unit1.weapon).to.be.undefined;
        });

        it('should swap items', function() {
            var commander = new Commander({key: 'moro'});
            var unit1 = new Unit({key: 'infantry'});
            var troop = new Troop({unit: commander}, [{unit: unit1}]);

            commander.updateItem('item', 'recovery-10');
            commander.updateItem('item', 'recovery-10');
            unit1.updateItem('item', 'recovery-50');
            troop.swapItem(0, 1, 'item');
            members[0] = commander;
            members[1] = unit1;
            formation[0] = 0;
            formation[1] = 1;

            expect(troop.members).to.eql(members);
            expect(troop.formation).to.eql(formation);
            expect(commander.items[0].key).to.eql('recovery-50');
            expect(commander.items.length).to.eql(1);
            expect(unit1.items[0].key).to.eql('recovery-10');
            expect(unit1.items[1].key).to.eql('recovery-10');
            expect(unit1.items.length).to.eql(2);
        });
    });

    describe('getters', function() {
        it('should return unit and index info', function() {
            var commander = new Commander({key: 'moro'});
            var unit1 = new Unit({key: 'infantry'});
            var unit2 = new Unit({key: 'infantry', preset: 'a'});
            var unit3 = new Unit({key: 'infantry', preset: 'b'});
            var troop = new Troop({unit: commander}, [{unit: unit1}, {unit: unit2}, {unit: unit3}]);

            expect(troop.getMemberIndexAtSlot(3)).to.eql(3);
            expect(troop.getMemberAtSlot(3)).to.eql(unit3);
            expect(troop.getUnitAt(3)).to.eql(unit3);
            expect(troop.getMemberIndex(unit3)).to.eql(3);
            expect(troop.getSlotIndex(unit3)).to.eql(3);
            expect(troop.getTotalHp()).to.eql(89);

            unit2.attrs.hp = 10;
            unit3.attrs.fatigue = 10;

            expect(troop.getTotalHp()).to.eql(79);
            expect(troop.getTreatmentCost()).to.eql(110);

            troop.treat();

            expect(troop.getTotalHp()).to.eql(89);
            expect(troop.getTreatmentCost()).to.eql(0);
        });

        it('should return isAlive of the troop', function() {
            var commander = new Commander({key: 'moro'});
            var unit1 = new Unit({key: 'infantry'});
            var unit2 = new Unit({key: 'infantry', preset: 'a'});
            var unit3 = new Unit({key: 'infantry', preset: 'b'});
            var troop = new Troop({unit: commander}, [{unit: unit1}, {unit: unit2}, {unit: unit3}]);

            commander.attrs.hp = 0;
            unit1.attrs.hp = 0;
            unit3.attrs.hp = 0;
            expect(troop.isAlive()).to.be.true;

            unit2.attrs.hp = 0;
            expect(troop.isAlive()).to.be.false;
        });

        it('should return total pay as sum of all members except the commander', function() {
            var commander = new Commander({key: 'moro'});
            var unit1 = new Unit({key: 'infantry'});
            var unit2 = new Unit({key: 'infantry', preset: 'a'});
            var unit3 = new Unit({key: 'infantry', preset: 'b'});
            var troop = new Troop({unit: commander}, [{unit: unit1}, {unit: unit2}, {unit: unit3}]);

            expect(troop.getPay()).to.equal(226);

            troop = new Troop({unit: commander});
            expect(troop.getPay()).to.equal(0);
        });
    });
});
