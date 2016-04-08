'use strict';

var STATES = require('../../configs/states');
var InitGame = require('../../lib/states/init-game');
var Store = require('../../lib/states/store');
var Region = require('../../lib/components/region');
var gameStateUtil = require('../../lib/utils/game-state-util');
var game;

function init() {
    var selectStore = document.querySelector('#select-store');
    var storeMap = {};
    var stores;

    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(STATES.InitGame, InitGame);
    game.state.add(STATES.Store, Store);

    game.state.start(STATES.InitGame, undefined, undefined, function() {
        game.gameState = gameStateUtil.getNewState();
        stores = Region.Pois.zelerd['west-zelerd-city'].stores;
        stores.forEach(function(store) {
            storeMap[store.name] = store;
            selectStore.appendChild(createOption(store));
        });
        game.state.start(STATES.Store, undefined, undefined, 'moro', storeMap[selectStore.value]);
    });

    selectStore.addEventListener('change', function() {
        game.state.start(STATES.Store, undefined, undefined, 'moro', storeMap[selectStore.value]);
    });

    return game;
}

function createOption(store) {
    var option = document.createElement('option');
    option.value = store.name;
    option.innerHTML = store.name;
    return option;
}

function getSetup() {
    return  '<label for="select-store">Store:</label>' +
            '<select name="select-store" id="select-store">' +
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
