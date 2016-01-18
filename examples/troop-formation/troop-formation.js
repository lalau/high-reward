'use strict';

var STATES = require('../../configs/states');
var InitGame = require('../../lib/states/init-game');
var TroopFormation = require('../../lib/states/troop-formation');
var gameStateUtil = require('../../lib/utils/game-state-util');
var game;

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(STATES.InitGame, InitGame);
    game.state.add(STATES.TroopFormation, TroopFormation);

    game.state.start(STATES.InitGame, undefined, undefined, function() {
        game.gameState = gameStateUtil.getNewState(game);

        game.gameState.troops.moro.members.forEach(function(unit) {
            if (unit) {
                unit.updateItem('item', 'recovery-10');
            }
        });

        game.gameState.troops.moro.members[1].updateItem('weapon');
        game.gameState.troops.moro.members[1].updateItem('protection');
        game.gameState.troops.moro.members[1].updateItem('item');

        game.state.start(STATES.TroopFormation, undefined, undefined, 'moro');
        updateDebugInfo();
        var readyInterval = setInterval(function() {
            var troopFormation = game.state.states[game.state.current];
            if (troopFormation._screen) {
                clearInterval(readyInterval);
                troopFormation._screen._panels.formation.events.onMovingUnitEnd.add(function() {
                    updateDebugInfo();
                });
            }
        });
    });

    return game;
}

function updateDebugInfo() {
    var troop = game.gameState.troops.moro;
    document.querySelector('#formation-info').innerHTML = 'Formation: ' + JSON.stringify(troop.formation);
}

function getSetup() {
    return  '<pre id="formation-info">Formation: </pre>';
}

function getName() {
    return 'Troop Formation Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
