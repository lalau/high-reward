'use strict';

var Commander = require('./commander');
var Unit = require('./unit');
var _ = {
    fill: require('lodash/array/fill')
};

function Troop(commander, members, config) {
    var commanderUnit = commander && commander.unit;

    this.commander = commanderUnit;

    this.members = [];
    this.members.length = 11;
    _.fill(this.members, undefined);

    this.formation = [];
    this.formation.length = 11;
    _.fill(this.formation, undefined);

    if (commanderUnit) {
        this.members[0] = commanderUnit;
        this.formation[commander.slotIndex || 0] = 0;
    }

    if (members) {
        members.forEach(function(member) {
            if (member) {
                this.addMember(member.unit, member.memberIndex, member.slotIndex);
            }
        }, this);
    }

    config = config || {};

    this.order = config.order || Troop.Order.STAY;
    this.move = config.move || Troop.Move.ON_FOOT;
    this.tactic = config.tactic || Troop.Tactic.NORMAL;
    this.formationIndex = config.formationIndex || 0;
    this.isRetreating = config.isRetreating !== undefined ? config.isRetreating : false;
    this.poi = config.poi;
    this.lastPoi = config.lastPoi;
    this.movements = config.movements;
    this.peacefulRounds = config.peacefulRounds || 0;
    this.name = config.name || '';
}

Troop.rehydrate = function(driedTroop) {
    var commander = driedTroop.commander && {
        unit: Commander.rehydrate(driedTroop.commander.unit),
        slotIndex: driedTroop.commander.slotIndex
    };
    var members = driedTroop.members.map(function(member) {
        return member && {
            unit: Unit.rehydrate(member.unit),
            memberIndex: member.memberIndex,
            slotIndex: member.slotIndex
        };
    });
    return new Troop(commander, members, driedTroop.config);
};

Troop.prototype.dehydrate = function() {
    return {
        commander: this.commander && {
            unit: this.commander.dehydrate(),
            slotIndex: this.getSlotIndex(this.commander)
        },
        members: this.members.map(function(member, memberIndex) {
            return member && member.type === 'unit' && {
                unit: member.dehydrate(),
                memberIndex: memberIndex,
                slotIndex: this.getSlotIndex(member)
            } || undefined;
        }, this),
        config: {
            order: this.order,
            move: this.move,
            tactic: this.tactic,
            formationIndex: this.formationIndex,
            isRetreating: this.isRetreating,
            poi: this.poi,
            lastPoi: this.lastPoi,
            movements: this.movements,
            peacefulRounds: this.peacefulRounds,
            name: this.name
        }
    };
};

Troop.prototype.getName = function() {
    return this.commander && this.commander.troopName || this.name;
};

Troop.prototype.getPay = function() {
    var pay = 0;

    this.members.forEach(function(unit) {
        if (unit) {
            pay += unit.getPay();
        }
    });

    return pay;
};

Troop.prototype.addMember = function(unit, memberIndex, slotIndex) {
    var members = this.members;
    var formation = this.formation;

    if (typeof memberIndex === 'number' && memberIndex < members.length && !members[memberIndex]) {
        members[memberIndex] = unit;
    } else {
        members.some(function(occupiedUnit, index) {
            if (!occupiedUnit) {
                members[index] = unit;
                memberIndex = index;
                return true;
            }
        });
    }

    if (typeof slotIndex === 'number' && slotIndex < formation.length && typeof formation[slotIndex] !== 'number') {
        formation[slotIndex] = memberIndex;
    } else {
        formation.some(function(occupiedMemberIndex, index) {
            if (typeof occupiedMemberIndex !== 'number') {
                formation[index] = memberIndex;
                return true;
            }
        });
    }
};

Troop.prototype.removeMember = function(memberIndex) {
    this.members[memberIndex] = undefined;
    this.formation[this.formation.indexOf(memberIndex)] = undefined;
};

Troop.prototype.replaceMember = function(memberIndex, unit) {
    var currentMember = this.members[memberIndex];

    if (unit) {
        if (currentMember) {
            this.members[memberIndex] = unit;
        } else {
            this.addMember(unit, memberIndex);
        }
    } else {
        this.removeMember(memberIndex);
    }
};

Troop.prototype.swapSlot = function(slotIndex1, slotIndex2) {
    var formation = this.formation;
    var memberIndex1 = formation[slotIndex1];

    formation[slotIndex1] = formation[slotIndex2];
    formation[slotIndex2] = memberIndex1;
};

Troop.prototype.swapItem = function(memberIndex1, memberIndex2, type) {
    var unit1 = this.members[memberIndex1];
    var unit2 = this.members[memberIndex2];
    var swapType = type === 'item' ? 'items' : type;
    var item1;
    var item2;
    var canSwap;

    if (!unit1 || !unit2) {
        return;
    }

    item1 = unit1[swapType];
    item2 = unit2[swapType];

    if (type === 'item') {
        canSwap = (item2.length === 0 || unit1.canHandle(type, item2[0].key)) && (item1.length === 0 || unit2.canHandle(type, item1[0].key));
    } else {
        canSwap = (!item2 || unit1.canHandle(type, item2.key)) && (!item1 || unit2.canHandle(type, item1.key));
    }

    if (canSwap) {
        unit1[swapType] = item2;
        unit2[swapType] = item1;
    }
};

Troop.prototype.getMemberIndexAtSlot = function(slotIndex) {
    return this.formation[slotIndex];
};

Troop.prototype.getMemberAtSlot = function(slotIndex) {
    return this.getUnitAt(this.formation[slotIndex]);
};

Troop.prototype.getUnitAt = function(index) {
    return this.members[index];
};

Troop.prototype.getMemberIndex = function(unit) {
    return this.members.indexOf(unit);
};

Troop.prototype.getSlotIndex = function(unit) {
    return this.formation.indexOf(this.getMemberIndex(unit));
};

Troop.prototype.isAlive = function() {
    return this.members.some(function(unit) {
        return unit && unit.attrs.hp > 0;
    });
};

Troop.prototype.getTotalHp = function() {
    var total = 0;

    this.members.forEach(function(unit) {
        if (unit) {
            total += unit.attrs.hp;
        }
    });

    return total;
};

Troop.prototype.getTreatmentCost = function() {
    var cost = 0;

    this.members.forEach(function(unit) {
        if (unit) {
            cost += (unit.attrs.maxHp - unit.attrs.hp) * 10 + unit.attrs.fatigue;
        }
    });

    return cost;
};

Troop.prototype.treat = function() {
    this.members.forEach(function(unit) {
        if (unit) {
            unit.attrs.hp = unit.attrs.maxHp;
            unit.attrs.fatigue = 0;
        }
    });
};

Troop.Order = {};
Troop.Order.STAY = 'stay';
Troop.Order.IDLE = 'idle';
Troop.Order.RETREAT = 'retreat';

Troop.Move = {};
Troop.Move.ON_FOOT = 'on foot';
Troop.Move.VEHICLE = 'vehicle';

Troop.Tactic = {};
Troop.Tactic.NORMAL = 'normal';
Troop.Tactic.SCOUT = 'scout';
Troop.Tactic.ALERT = 'alert';

module.exports = Troop;
