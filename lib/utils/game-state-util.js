'use strict';

var moment = require('moment');
var Region = require('../components/region');
var Commander = require('../models/commander');
var Unit = require('../models/unit');
var Troop = require('../models/troop');
var grid = { zelerd: require('../../configs/maps/zelerd/grid') };
var pois = { zelerd: require('../../configs/maps/zelerd/poi') };
var _ = {
    map: require('lodash/collection/map'),
    indexBy: require('lodash/collection/indexBy')
};

var gameStateUtil = {};

gameStateUtil.getNewState = function(game) {
    return {
        worldTime: moment('0632-04-16T00:00:00.000Z').utc(),
        nextCollectDate: undefined,
        introduced: false,
        collectorIntroduced: false,
        currentRegion: gameStateUtil._createRegion(game, 'zelerd'),
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
        introduced: gameState.introduced,
        collectorIntroduced: gameState.collectorIntroduced,
        currentRegion: gameState.currentRegion.getName(),
        troops: _.indexBy(_.map(gameState.troops, function(troop) {
            return troop.dehydrate();
        }), 'commander.unit.unitConfig.key'),
        debt: gameState.debt,
        pay: gameState.pay,
        bank: gameState.bank,
        works: gameState.works
    };
};

gameStateUtil.rehydrate = function(game, driedState) {
    return {
        worldTime: moment(driedState.worldTime).utc(),
        nextCollectDate: driedState.nextCollectDate ? moment(driedState.nextCollectDate).utc() : undefined,
        introduced: driedState.introduced,
        collectorIntroduced: driedState.collectorIntroduced,
        currentRegion: gameStateUtil._createRegion(game, driedState.currentRegion), // _flags and _navicons
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

gameStateUtil._createRegion = function(game, regionName) {
    return new Region(game, regionName, grid[regionName], pois[regionName]);
};

module.exports = gameStateUtil;
