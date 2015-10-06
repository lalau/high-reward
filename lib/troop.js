'use strict';

var _ = {
    fill: require('lodash/array/fill')
};

function Troop(config) {
    this.commander = config.commander;

    this.members = [];
    this.members.length = 10;
    _.fill(this.members, undefined);

    this.order = Troop.Order.STAY;
    this.move = Troop.Move.ON_FOOT;
    this.tactic = Troop.Tactic.NORMAL;
    this.formationIndex = 0;

    this.formation = ['L'];
    this.formation.length = 11;
    _.fill(this.formation, undefined, 1);
}

Troop.prototype.getName = function() {
    return this.commander.troopName;
};

Troop.prototype.getPay = function() {
    return 120;
};

Troop.prototype.addMember = function(member, index) {
    var members = this.members;
    var formation = this.formation;

    if (index !== undefined && index < members.length) {
        members[index] = member;
    }

    formation.some(function(memberIndex, slotIndex) {
        if (memberIndex === undefined) {
            formation[slotIndex] = index;
            return true;
        }
    });
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

Troop.prototype.getUnitAt = function(index) {
    if (index === 'L') {
        return this.commander;
    } else {
        return this.members[index];
    }
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
