'use strict';

var moment = require('moment');
var Region = require('../components/region');
var Commander = require('../models/commander');
var Unit = require('../models/unit');
var Troop = require('../models/troop');
var grid = { zelerd: require('../../configs/maps/zelerd/grid') };
var pois = { zelerd: require('../../configs/maps/zelerd/poi') };

var gameStateUtil = {};

gameStateUtil.getNewState = function(game) {
    return {
        worldTime: moment('0632-04-16 00', 'YYYY-MM-DD HH'),
        introduced: true,
        currentRegion: gameStateUtil._createRegion(game, 'zelerd'),
        troops: gameStateUtil._getNewTroops(),
        debt: 10000000,
        pay: 5000,
        bank: 8000
    };
};

gameStateUtil._getNewTroops = function() {
    var commanders = ['moro', 'jesse', 'lu', 'sal'];
    var troops = {};

    commanders.forEach(function(commanderKey) {
        var commander = new Commander({ key: commanderKey });
        var troop = new Troop(commander, [
            { unit: new Unit({key: 'infantry'}) },
            { unit: new Unit({key: 'infantry'}) },
            { unit: new Unit({key: 'armoured-infantry'}) },
            { unit: new Unit({key: 'armoured-infantry'}) },
            { unit: new Unit({key: 'mechanized-infantry'}) },
            { unit: new Unit({key: 'mechanized-infantry'}) },
            { unit: new Unit({key: 'mechanized-infantry'}) }
        ]);

        troop.members.forEach(function(unit) {
            if (unit && unit.type === 'unit') {
                unit.updateItem('weapon', 'canan-1688');
                unit.updateItem('protection', 'aluminium-armor');
            }
        });

        troop.poi = 'Zelerd City';
        troops[commanderKey] = troop;
    });

    return troops;
};

gameStateUtil._createRegion = function(game, regionName) {
    return new Region(game, regionName, grid[regionName], pois[regionName]);
};

module.exports = gameStateUtil;
