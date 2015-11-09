'use strict';

var InitGame = require('../../lib/states/init-game');
var Conversation = require('../../lib/states/conversation');
var game;

function init() {
    var selectScript = document.querySelector('#select-script');

    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(InitGame.NAME, InitGame);
    game.state.add(Conversation.NAME, Conversation);
    game.state.start(InitGame.NAME);

    selectScript.addEventListener('change', function() {
        var scriptKey = selectScript.value;

        if (!scriptKey) {
            game.state.start(InitGame.NAME);
            return;
        }

        game.state.start(Conversation.NAME, undefined, undefined, {
            scriptKey: scriptKey,
            done: function() {
                game.state.start(InitGame.NAME);
                selectScript.value = '';
            }
        });
    });

    return game;
}

function getSetup() {
    return  '<div>' +
                '<label for="select-script">Script:</label>' +
                ' ' +
                '<select name="script" id="select-script" value="moro">' +
                    '<option value=""></option>' +
                    '<option value="introduction">Introduction</option>' +
                '</select>' +
            '</div>';
}

function getName() {
    return 'Conversation Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
