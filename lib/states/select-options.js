'use strict';

var SelectMenu = require('../menus/select-menu');
var OverlayState = require('./overlay-state');

function SelectOptions(game) {
    OverlayState.call(this, game);

    this.game = game;
}

SelectOptions.prototype = Object.create(OverlayState.prototype);

SelectOptions.NAME = 'select-options';

SelectOptions.prototype.init = function(x, y, options) {
    this._menuX = x;
    this._menuY = y;
    this._options = options;
};

SelectOptions.prototype._getMenu = function() {
    var menu = {
        options: this._options.map(function(option) {
            return {
                key: option.key,
                text: option.text,
                enabled: option.enabled
            };
        })
    };

    return menu;
};

SelectOptions.prototype.create = function() {
    OverlayState.prototype.create.call(this, OverlayState.NO_OP);

    var game = this.game;
    var menu = this._getMenu();
    var selectMenu = new SelectMenu(game, this._menuX, this._menuY, 'auto', menu);

    game.stage.addChild(selectMenu);

    this._options.forEach(function(option) {
        if (option.enabled !== false) {
            selectMenu.onClick(option.key, function() {
                option.callback();
            });
        }
    });

    this._selectMenu = selectMenu;
};

SelectOptions.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._selectMenu.destroy();
};

module.exports = SelectOptions;
