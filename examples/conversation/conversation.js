'use strict';

var InitGame = require('../../lib/states/init-game');
var Conversation = require('../../lib/states/conversation');
var SelectOptions = require('../../lib/states/select-options');
var game;

function init() {
    var selectScript = document.querySelector('#select-script');

    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(InitGame.NAME, InitGame);
    game.state.add(Conversation.NAME, Conversation);
    game.state.add(SelectOptions.NAME, SelectOptions);
    game.state.start(InitGame.NAME);

    selectScript.addEventListener('change', function() {
        var values = selectScript.value.split(',');
        var scriptGroup = values[0];
        var scriptKey = values[1];

        if (!scriptKey) {
            game.state.start(InitGame.NAME);
            return;
        }

        game.state.start(Conversation.NAME, undefined, undefined, {
            scriptGroup: scriptGroup,
            scriptKey: scriptKey,
            done: function() {
                game.state.start(InitGame.NAME);
                selectScript.value = '';
            },
            data: {
                name: 'Zelerd City',
                amount: 350
            },
            onSelect: {
                treat: function(/*value*/) {
                    // console.log(value);
                }
            }
        });
    });

    return game;
}

function getSetup() {
    return  '<div>' +
                '<label for="select-script">Script:</label>' +
                ' ' +
                '<select name="script" id="select-script">' +
                    '<option value=""></option>' +
                    '<option value="conversation,introduction">Conversation - Introduction</option>' +
                    '<option value="hospital,healthy">Hospital - Healthy</option>' +
                    '<option value="hospital,treatment">Hospital - Treatment</option>' +
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
