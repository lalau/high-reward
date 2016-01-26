'use strict';

var Unit = require('../models/unit');
var Troop = require('../models/troop');
var Regions = require('../components/region').Regions;
var battleUtil = {};
var _ = {
    sample: require('lodash/collection/sample')
};

battleUtil.computeFire = function(firingUnit, targetUnit) {
    if (Math.random() < 0.1) {
        return {
            missed: true
        };
    }

    var damage = Math.min(targetUnit.attrs.hp, battleUtil.getDamage(firingUnit.attrs.shoot, targetUnit.attrs.defence, 0.2));
    var isCritical = Math.random() < 0.2;

    if (isCritical) {
        damage = Math.floor((Math.random() * 0.5 + 1.25) * damage);
    }

    return {
        damage: damage,
        expert: battleUtil.computeExpert(firingUnit, targetUnit),
        isCritical: isCritical
    };
};

battleUtil.computeExpert = function(firingUnit, targetUnit) {
    var expertFactor = Math.pow(targetUnit.attrs.maxHp / firingUnit.attrs.maxHp, 1.5);
    var expert = Math.min(Math.max(Math.round(expertFactor * 100), 20), 250);

    return expert;
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

battleUtil.getRegionalTroop = function(key) {
    var unitCount = Math.floor(Math.random() * 11) + 1;
    var troopData = _.sample(Regions[key].troops);
    var troopMembers = [];
    var troop;
    var unitData;

    while(unitCount--) {
        unitData = _.sample(troopData.units);
        troopMembers.push({
            unit: new Unit({
                key: unitData.key,
                preset: unitData.preset,
                unitConfig: {
                    weapon: 'canan-1688',
                    protection: 'aluminium-armor'
                }
            })
        });
    }

    troop = new Troop(undefined, troopMembers, { name: troopData.name });
    troop.formationIndex = Math.floor(Math.random() * 16);

    return troop;
};

module.exports = battleUtil;
