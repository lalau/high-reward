'use strict';

var InitGame = require('../../lib/states/init-game');
var Battle = require('../../lib/states/battle');
var gameStateUtil = require('../../lib/utils/game-state-util');
var battleUtil = require('../../lib/utils/battle-util');
var game;
var controlButton;

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(InitGame.NAME, InitGame);
    game.state.add(Battle.NAME, Battle);

    game.state.start(InitGame.NAME, undefined, undefined, function() {
        game.gameState = gameStateUtil.getNewState(game);
        game.state.start(Battle.NAME, undefined, undefined, battleUtil.getRegionalTroop(), game.gameState.troops.moro);
        controlButton.innerHTML = 'Pause';
    });

    controlButton = document.querySelector('#control');
    controlButton.addEventListener('click', control);

    return game;
}

function control() {
    var battleScreen = game.state.states[game.state.current]._screen;

    if (battleScreen.isPaused()) {
        controlButton.innerHTML = 'Pause';
        battleScreen.resume();
    } else {
        controlButton.innerHTML = 'Resume';
        battleScreen.pause();
    }
}

function getSetup() {
    return '<button id="control"></button>';
}

function getName() {
    return 'Battle Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
