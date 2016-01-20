'use strict';

var Unit = require('../models/unit');
var Troop = require('../models/troop');
var battleUtil = {};

battleUtil.computeFire = function(unit1, unit2) {
    if (Math.random() < 0.1) {
        return { missed: true };
    }

    var damage = Math.min(unit2.attrs.hp, battleUtil.getDamage(unit1.attrs.shoot, unit2.attrs.defence, 0.2));
    var isCritical = Math.random() < 0.2;

    if (isCritical) {
        damage = Math.floor((Math.random() * 0.5 + 1.25) * damage);
    }

    return {
        damage: damage,
        isCritical: isCritical
    };
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
        troopMembers.push({
            unit: new Unit({
                key: 'infantry',
                unitConfig: {
                    weapon: 'canan-1688',
                    protection: 'aluminium-armor'
                }
            })
        });
    }

    troop = new Troop(undefined, troopMembers);
    troop.formationIndex = Math.floor(Math.random() * 16);

    return troop;
};

module.exports = battleUtil;
