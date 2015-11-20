'use strict';

var _ = {
    fill: require('lodash/array/fill')
};

function Troop(commander, members) {
    this.commander = commander;

    this.members = commander && [commander] || [];
    this.members.length = 11;
    _.fill(this.members, undefined, commander ? 1 : 0);

    this.order = Troop.Order.STAY;
    this.move = Troop.Move.ON_FOOT;
    this.tactic = Troop.Tactic.NORMAL;
    this.formationIndex = 0;

    this.formation = commander && [0] || [];
    this.formation.length = 11;
    _.fill(this.formation, undefined, commander ? 1 : 0);

    if (members) {
        members.forEach(function(member) {
            this.addMember(member.unit, member.memberIndex, member.slotIndex);
        }, this);
    }
}

Troop.prototype.getName = function() {
    return this.commander && this.commander.troopName || '';
};

Troop.prototype.getPay = function() {
    return 120;
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
    if (unit) {
        this.members[memberIndex] = unit;
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

Troop.Order = {};
Troop.Order.STAY = 'stay';
Troop.Order.IDLE = 'idle';
Troop.Order.RETREAT = 'retreat';

Troop.Move = {};
Troop.Move.ON_FOOT = 'on foot';

Troop.Tactic = {};
Troop.Tactic.NORMAL = 'normal';
Troop.Tactic.SCOUT = 'scout';
Troop.Tactic.ALERT = 'alert';

module.exports = Troop;
