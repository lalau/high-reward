'use strict';

var SelectMenu = require('../menus/select-menu');
var OverlayState = require('./overlay-state');

function SelectOptions(game) {
    OverlayState.call(this, game);

    this.game = game;
}

SelectOptions.prototype = Object.create(OverlayState.prototype);

SelectOptions.NAME = 'select-options';

SelectOptions.WIDTH = 150;

SelectOptions.prototype.init = function(options) {
    this._options = options;
};

SelectOptions.prototype._getMenu = function() {
    var menu = {
        options: this._options.map(function(option) {
            return {
                key: option.key,
                text: option.text
            };
        })
    };

    return menu;
};

SelectOptions.prototype.create = function() {
    OverlayState.prototype.create.call(this, OverlayState.NO_OP);

    var game = this.game;
    var menu = this._getMenu();
    var menuHeight = SelectMenu.getMenuHeight(menu);
    var menuX = Math.floor((game.width - SelectOptions.WIDTH) / 2);
    var menuY = Math.floor((game.height - menuHeight) / 2);
    var selectMenu = new SelectMenu(game, menuX, menuY, SelectOptions.WIDTH, menu);

    game.stage.addChild(selectMenu);

    this._options.forEach(function(option) {
        selectMenu.onClick(option.key, function() {
            option.callback();
        });
    });

    this._selectMenu = selectMenu;
};

SelectOptions.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._selectMenu.destroy();
};

module.exports = SelectOptions;
