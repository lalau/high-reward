'use strict';

var STATES = require('../../configs/states');
var InitGame = require('../../lib/states/init-game');
var Conversation = require('../../lib/states/conversation');
var SelectOptions = require('../../lib/states/select-options');
var npc = require('../../configs/npc');
var gameStateUtil = require('../../lib/utils/game-state-util');
var game;

function init() {
    var selectScript = document.querySelector('#select-script');

    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(STATES.InitGame, InitGame);
    game.state.add(STATES.Conversation, Conversation);
    game.state.add(STATES.SelectOptions, SelectOptions);
    game.state.start(STATES.InitGame);

    selectScript.addEventListener('change', function() {
        var values = selectScript.value.split(',');
        var scriptGroup = values[0];
        var scriptKey = values[1];
        var amount;

        if (!scriptKey) {
            game.state.start(STATES.InitGame);
            return;
        }

        if (!game.gameState) {
            game.gameState = gameStateUtil.getNewState(game);
        }

        game.state.start(STATES.Conversation, undefined, undefined, {
            scriptGroup: scriptGroup,
            scriptKey: scriptKey,
            speakerMap: {
                hospital: npc.hospital
            },
            done: function() {
                game.state.start(STATES.InitGame);
                selectScript.value = '';
            },
            data: {
                name: 'Zelerd City',
                amount: function() {
                    return amount || 350;
                },
                remaining: function() {
                    return game.gameState.debt - amount;
                }
            },
            onSelect: {
                amount: function(selectAmount) {
                    amount = selectAmount;
                }
            },
            onOptions: {
                amount: function(options) {
                    var canAfford = game.gameState.bank >= 5000;

                    return options.filter(function(option) {
                        if (option.key) {
                            if (option.key === 'pay-5000' && !canAfford) {
                                return false;
                            } else if (option.key === 'pay-unable' && canAfford) {
                                return false;
                            }
                        }
                        return true;
                    });
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
                    '<option value="conversation,collector-introduction">Collector - Introduction</option>' +
                    '<option value="conversation,collector-collect">Collector - Collect</option>' +
                    '<option value="conversation,battle-lose">Conversation - Battle Lose</option>' +
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
