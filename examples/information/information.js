'use strict';

var InitGame = require('../../lib/states/init-game');
var Information = require('../../lib/states/information');
var game;

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(InitGame.NAME, InitGame);
    game.state.add(Information.NAME, Information);
    game.state.start(InitGame.NAME, undefined, undefined, function() {
        game.state.start(Information.NAME, undefined, undefined, {
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
