'use strict';

var InitGame = require('../../lib/states/init-game');
var Store = require('../../lib/states/store');
var gameStateUtil = require('../../lib/utils/game-state-util');
var game;

var stores = {
    agency: {
        name: 'Notrenilly Agency',
        ownerKey: 'agency-owner',
        type: 'agency',
        offers: [
            { key: 'infantry' },
            { key: 'infantry', preset: 'a' },
            { key: 'infantry', preset: 'b' }
        ]
    },
    weapon: {
        name: 'Sarelo Weapon Store',
        ownerKey: 'weapon-owner',
        type: 'weapon',
        offers: [
            { key: 'tima' },
            { key: 'punav' },
            { key: 'canan-1688' },
            { key: 'canan-2788' }
        ]
    },
    protection: {
        name: 'Ramikoa Protection Store',
        ownerKey: 'protection-owner',
        type: 'protection',
        offers: [
            { key: 'cloth-armor' },
            { key: 'leather-armor' },
            { key: 'aluminium-armor' },
            { key: 'copper-armor' }
        ]
    }
};

function init() {
    var selectStore = document.querySelector('#select-store');

    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(InitGame.NAME, InitGame);
    game.state.add(Store.NAME, Store);

    game.state.start(InitGame.NAME, undefined, undefined, function() {
        game.gameState = gameStateUtil.getNewState(game);
        game.state.start(Store.NAME, undefined, undefined, 'moro', stores[selectStore.value]);
    });

    // setInterval(updateDebugInfo, 50);

    selectStore.addEventListener('change', function() {
        game.state.start(Store.NAME, undefined, undefined, 'moro', stores[selectStore.value]);
    });

    return game;
}

// function updateDebugInfo() {
//     var members = game.gameState && game.gameState.troops.moro.members.map(function(member) {
//         return member && member.key || '';
//     });
//     if (document.querySelector('#troop-info')) {
//         document.querySelector('#troop-info').innerHTML = 'Troop: ' + JSON.stringify(members);
//     }
// }

function getSetup() {
    // return  '<pre id="troop-info">Troop: </pre>';
    return  '<label for="select-store">Store:</label>' +
            '<select name="select-store" id="select-store">' +
                '<option value="agency">Agency</option>' +
                '<option value="weapon">Weapon</option>' +
                '<option value="protection">Protection</option>' +
            '</select>';
}

function getName() {
    return 'Store Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
