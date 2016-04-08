'use strict';

var STATES = require('../../configs/states');
var pois = require('../../configs/maps/zelerd/poi');
var InitGame = require('../../lib/states/init-game');
var CityInfo = require('../../lib/states/city-info');
var gameStateUtil = require('../../lib/utils/game-state-util');
var game;

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(STATES.InitGame, InitGame);
    game.state.add(STATES.CityInfo, CityInfo);

    game.state.start(STATES.InitGame, undefined, undefined, function() {
        game.gameState = gameStateUtil.getNewState();
        game.state.start(STATES.CityInfo, undefined, undefined, pois['zelerd-city']);
    });

    return game;
}

function getSetup() {
    return '';
}

function getName() {
    return 'City Info Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
