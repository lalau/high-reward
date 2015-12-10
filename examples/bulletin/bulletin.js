'use strict';

var InitGame = require('../../lib/states/init-game');
var Bulletin = require('../../lib/states/bulletin');
var SelectOptions = require('../../lib/states/select-options');
var Conversation = require('../../lib/states/conversation');
var gameStateUtil = require('../../lib/utils/game-state-util');
var Region = require('../../lib/components/region');
var grid = require('../../configs/maps/zelerd/grid');
var pois = require('../../configs/maps/zelerd/poi');
var game;

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(InitGame.NAME, InitGame);
    game.state.add(Bulletin.NAME, Bulletin);
    game.state.add(Conversation.NAME, Conversation);
    game.state.add(SelectOptions.NAME, SelectOptions);
    game.state.start(InitGame.NAME, undefined, undefined, function() {
        game.stage.addChild(new Region(game, 'zelerd', grid, pois));
        game.gameState = gameStateUtil.getNewState(game);
    });

    document.querySelector('#public-bulletin-button').addEventListener('click', function() {
        game.state.start(Bulletin.NAME, undefined, undefined, 'moro');
    });

    return game;
}

function getSetup() {
    return  '<button id="public-bulletin-button">Public Bulletin</button>';
}

function getName() {
    return 'Bulletin Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
