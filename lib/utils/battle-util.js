'use strict';

var Unit = require('../models/unit');
var Troop = require('../models/troop');
var battleUtil = {};

battleUtil.computeFire = function(unit1, unit2) {
    if (Math.random() < 0.1) {
        return { missed: true };
    }

    var damage = Math.min(unit2.attrs.hp, battleUtil.getDamage(unit1.attrs.shoot, unit2.attrs.defence, 0.2));
    unit2.attrs.hp -= damage;

    if (!unit2.attrs.hp) {
        unit2.battleAttrs.isDead = true;
    }

    return { damage: damage };
};

battleUtil.getDamage = function(attack, defense, defenseFactor) {
    return Math.max(0,
        Math.min(attack + battleUtil._rollDice(2, 2), attack + battleUtil._rollDice(2, 2)) -
        Math.floor(
            (defense + battleUtil._rollDice(2, 2)) * defenseFactor
        )
    );
};

battleUtil._rollDice = function(count, sides) {
    var value = 0;

    while(count--) {
        value += Math.floor(Math.random() * (sides + 1));
    }

    return value;
};

battleUtil.getRegionalTroop = function() {
    var unitCount = Math.floor(Math.random() * 11) + 1;
    var troopMembers = [];
    var troop;

    while(unitCount--) {
        troopMembers.push({ unit: new Unit({key: 'infantry'}) });
    }

    troop = new Troop(undefined, troopMembers);
    troop.formationIndex = Math.floor(Math.random() * 16);

    return troop;
};

module.exports = battleUtil;
