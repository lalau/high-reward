'use strict';

var SelectMenu = require('../menus/select-menu');
var OverlayState = require('./overlay-state');
var Store = require('./store');

function StoreMenu(game) {
    OverlayState.call(this, game);

    this.game = game;
}

StoreMenu.prototype = Object.create(OverlayState.prototype);

StoreMenu.NAME = 'store-menu';

StoreMenu.WIDTH = 300;

StoreMenu.prototype.init = function(commanderKey) {
    this._commanderKey = commanderKey || this._commanderKey;
};

StoreMenu.prototype._getMenu = function() {
    var gameState = this.game.gameState;
    var troop = gameState.troops[this._commanderKey];
    var poi = gameState.currentRegion.getPoi(troop.poi);
    var menu = {
        title: poi.name
    };

    menu.options = poi.stores.map(function(store) {
        return { key: store.name, text: store.name, data: store };
    });

    return menu;
};

StoreMenu.prototype.create = function() {
    OverlayState.prototype.create.call(this);

    var game = this.game;
    var commanderKey = this._commanderKey;
    var gameState = game.gameState;
    var troop = gameState.troops[commanderKey];
    var poi = gameState.currentRegion.getPoi(troop.poi);
    var y = poi.y - 20;
    var menu = this._getMenu();
    var selectMenu = new SelectMenu(game, poi.x - StoreMenu.WIDTH / 2, y, StoreMenu.WIDTH, menu);

    game.stage.addChild(selectMenu);

    menu.options.forEach(function(option) {
        selectMenu.onClick(option.key, function() {
            game.state.start(Store.NAME, undefined, undefined, commanderKey, option.data);
        });
    });

    this._selectMenu = selectMenu;
};

StoreMenu.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._selectMenu.destroy();
};

module.exports = StoreMenu;
