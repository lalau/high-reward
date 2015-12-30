'use strict';

var StoreScreen = require('../screens/store/store-screen');
var OverlayState = require('./overlay-state');
var tweenUtil = require('../utils/tween-util');

function Store(game) {
    OverlayState.call(this, game);

    this.game = game;
}

Store.prototype = Object.create(OverlayState.prototype);

Store.NAME = 'unit-store';

Store.prototype.init = function(commanderKey, store) {
    this._troop = this.game.gameState.troops[commanderKey];
    this._store = store;
};

Store.prototype.create = function() {
    var game = this.game;

    OverlayState.prototype.create.call(this);

    this._screen = tweenUtil.fadeIn(game.stage.addChild(new StoreScreen(game, this._troop, this._store)));
};

Store.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._screen.destroy();
};

module.exports = Store;
