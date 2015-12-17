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

    if (poi.stores) {
        menu.options = poi.stores.map(function(store) {
            return { key: store.name, text: store.name, data: store };
        });
    }

    return menu;
};

StoreMenu.prototype.create = function() {
    OverlayState.prototype.create.call(this);

    var game = this.game;
    var commanderKey = this._commanderKey;
    var gameState = game.gameState;
    var troop = gameState.troops[commanderKey];
    var poi = gameState.currentRegion.getPoi(troop.poi);
    var menu = this._getMenu();
    var menuWidth = SelectMenu.getAutoMenuWidth(menu);
    var selectMenu = new SelectMenu(game, poi.x - menuWidth / 2, poi.y - 20, menuWidth, menu);

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
