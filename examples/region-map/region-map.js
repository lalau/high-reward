'use strict';

var STATES = require('../../configs/states');
var InitGame = require('../../lib/states/init-game');
var RegionMap = require('../../lib/states/region-map');
var gameStateUtil = require('../../lib/utils/game-state-util');
var game;

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(STATES.InitGame, InitGame);
    game.state.add(STATES.RegionMap, RegionMap);

    game.state.start(STATES.InitGame, undefined, undefined, function() {
        game.gameState = gameStateUtil.getNewState();
        game.gameState.collectorIntroduced = true;
        game.gameState.introduced = true;
        game.state.start(STATES.RegionMap);
    });

    return game;
}

function getSetup() {
    return  '';
}

function getName() {
    return 'Region Map Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
