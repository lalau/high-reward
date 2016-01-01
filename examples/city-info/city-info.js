'use strict';

var pois = require('../../configs/maps/zelerd/poi');
var InitGame = require('../../lib/states/init-game');
var CityInfo = require('../../lib/states/city-info');
var gameStateUtil = require('../../lib/utils/game-state-util');
var game;

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(InitGame.NAME, InitGame);
    game.state.add(CityInfo.NAME, CityInfo);

    game.state.start(InitGame.NAME, undefined, undefined, function() {
        game.gameState = gameStateUtil.getNewState(game);
        game.state.start(CityInfo.NAME, undefined, undefined, pois['zelerd-city']);
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
