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

SelectOptions.prototype._getMenuXY = function(menu) {
    var game = this.game;
    var menuX = this._menuX;
    var menuY = this._menuY;
    var menuHeight = SelectMenu.getMenuHeight(menu);

    if (menuX === 'center') {
        menuX = Math.floor((game.width - SelectOptions.WIDTH) / 2);
    } else if (menuX === 'pointer') {
        menuX = Math.floor(game.input.x - SelectOptions.WIDTH / 2);
    }

    if (menuY === 'center') {
        menuY = Math.floor((game.height - menuHeight) / 2);
    } else if (menuY === 'pointer') {
        menuY = Math.floor(game.input.y - SelectMenu.OPTION_HEIGHT);
    }

    return {
        x: menuX,
        y: menuY
    };
};

SelectOptions.prototype.create = function() {
    OverlayState.prototype.create.call(this, OverlayState.NO_OP);

    var game = this.game;
    var menu = this._getMenu();
    var menuXY = this._getMenuXY(menu);
    var selectMenu = new SelectMenu(game, menuXY.x, menuXY.y, SelectOptions.WIDTH, menu);

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
