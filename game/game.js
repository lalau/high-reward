'use strict';

var STATES = require('../configs/states');
var StateUtil = require('../lib/utils/state-util');
var game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);

game.stateUtil = new StateUtil(game);
game.stateUtil.loadStates();

game.state.start(STATES.InitGame, undefined, undefined, function() {
    game.state.start(STATES.MainMenu);
});

window.game = game;
