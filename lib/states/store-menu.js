'use strict';

var STATES = require('../../configs/states');
var SelectMenu = require('../menus/select-menu');
var OverlayState = require('./overlay-state');
var tweenUtil = require('../utils/tween-util');

function StoreMenu(game) {
    OverlayState.call(this, game);

    this.game = game;
}

StoreMenu.prototype = Object.create(OverlayState.prototype);

StoreMenu.prototype.init = function(commanderKey, poi) {
    this._commanderKey = commanderKey || this._commanderKey;
    this._poi = poi || this._poi;
};

StoreMenu.prototype._getMenu = function() {
    var poi = this._poi;
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
    var poi = this._poi;
    var menu = this._getMenu();
    var menuWidth = SelectMenu.getAutoMenuWidth(menu);
    var selectMenu = new SelectMenu(game, poi.x - menuWidth / 2, poi.y - 20, menuWidth, menu);

    tweenUtil.fadeIn(game.stage.addChild(selectMenu));

    menu.options.forEach(function(option) {
        if (option.data.type) {
            selectMenu.onClick(option.key, function() {
                game.state.start(STATES.Store, undefined, undefined, commanderKey, option.data);
            });
        }
    });

    this._selectMenu = selectMenu;
};

StoreMenu.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._selectMenu.destroy();
};

module.exports = StoreMenu;
