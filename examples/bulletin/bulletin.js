'use strict';

var InitGame = require('../../lib/states/init-game');
var Bulletin = require('../../lib/states/bulletin');
var SelectOptions = require('../../lib/states/select-options');
var Conversation = require('../../lib/states/conversation');
var gameStateUtil = require('../../lib/utils/game-state-util');
var game;

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(InitGame.NAME, InitGame);
    game.state.add(Bulletin.NAME, Bulletin);
    game.state.add(Conversation.NAME, Conversation);
    game.state.add(SelectOptions.NAME, SelectOptions);
    game.state.start(InitGame.NAME, undefined, undefined, function() {
        game.gameState = gameStateUtil.getNewState(game);
        game.state.start(Bulletin.NAME, undefined, undefined, 'moro');
    });

    return game;
}

function getSetup() {
    return  '';
}

function getName() {
    return 'Bulletin Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
