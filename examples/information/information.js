'use strict';

var STATES = require('../../configs/states');
var InitGame = require('../../lib/states/init-game');
var Information = require('../../lib/states/information');
var game;

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(STATES.InitGame, InitGame);
    game.state.add(STATES.Information, Information);
    game.state.start(STATES.InitGame, undefined, undefined, function() {
        game.state.start(STATES.Information, undefined, undefined, {
            speaker: 'moro',
            key: 'arrival',
            config: {
                name: 'Zelerd City'
            }
        });
    });

    return game;
}

function getSetup() {
    return  '';
}

function getName() {
    return 'Information Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
