'use strict';

var moment = require('moment');
var Commander = require('../models/commander');
var Unit = require('../models/unit');
var Troop = require('../models/troop');
var _ = {
    map: require('lodash/collection/map'),
    indexBy: require('lodash/collection/indexBy')
};

var gameStateUtil = {};

gameStateUtil.getNewState = function() {
    return {
        worldTime: moment('0632-04-16T00:00:00.000Z').utc(),
        nextCollectDate: undefined,
        lastPaidDate: undefined,
        introduced: false,
        collectorIntroduced: false,
        currentRegion: 'zelerd',
        troops: gameStateUtil._getNewTroops(),
        debt: 10000000,
        pay: 5000,
        bank: 8000,
        works: []
    };
};

gameStateUtil.dehydrate = function(gameState) {
    return {
        worldTime: gameState.worldTime.toISOString(),
        nextCollectDate: gameState.nextCollectDate ? gameState.nextCollectDate.toISOString() : undefined,
        lastPaidDate: gameState.lastPaidDate,
        introduced: gameState.introduced,
        collectorIntroduced: gameState.collectorIntroduced,
        currentRegion: gameState.currentRegion,
        troops: _.indexBy(_.map(gameState.troops, function(troop) {
            return troop.dehydrate();
        }), 'commander.unit.unitConfig.key'),
        debt: gameState.debt,
        pay: gameState.pay,
        bank: gameState.bank,
        works: gameState.works
    };
};

gameStateUtil.rehydrate = function(driedState) {
    return {
        worldTime: moment(driedState.worldTime).utc(),
        nextCollectDate: driedState.nextCollectDate ? moment(driedState.nextCollectDate).utc() : undefined,
        lastPaidDate: driedState.lastPaidDate,
        introduced: driedState.introduced,
        collectorIntroduced: driedState.collectorIntroduced,
        currentRegion: driedState.currentRegion,
        troops: _.indexBy(_.map(driedState.troops, function(driedTroop) {
            return Troop.rehydrate(driedTroop);
        }), 'commander.key'),
        debt: driedState.debt,
        pay: driedState.pay,
        bank: driedState.bank,
        works: driedState.works
    };
};

gameStateUtil._getNewTroops = function() {
    var commanders = ['moro', 'jesse', 'lu', 'sal'];
    // var commanders = ['moro'];
    var troops = {};

    commanders.forEach(function(commanderKey) {
        var commander = new Commander({ key: commanderKey });
        var troop = new Troop(
                { unit: commander }, [
                    { unit: new Unit({key: 'infantry'}) },
                    { unit: new Unit({key: 'infantry'}) },
                    { unit: new Unit({key: 'infantry'}) }
                ], {
                    poi: 'zelerd-city'
                }
        );

        troop.members.forEach(function(unit) {
            if (unit && unit.type === 'unit') {
                unit.updateItem('weapon', 'canan-1688');
                unit.updateItem('protection', 'aluminium-armor');
            }
        });

        troops[commanderKey] = troop;
    });

    return troops;
};

module.exports = gameStateUtil;
