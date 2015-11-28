'use strict';

var SelectMenu = require('../menus/select-menu');
var OverlayState = require('./overlay-state');
var SelectOptions = require('./select-options');

function BattleMenu(game) {
    OverlayState.call(this, game);

    this.game = game;
}

BattleMenu.prototype = Object.create(OverlayState.prototype);

BattleMenu.NAME = 'battle-menu';

BattleMenu.WIDTH = 150;

BattleMenu.prototype.init = function(battleScreen) {
    this._battleScreen = battleScreen || this._battleScreen;
};

BattleMenu.prototype._getMenu = function() {
    var menu = {
        title: 'COMMAND',
        options: [
            { key: 'retreat', text: 'RETREAT' }
        ]
    };

    return menu;
};

BattleMenu.prototype.create = function() {
    OverlayState.prototype.create.call(this);

    var game = this.game;
    var menu = this._getMenu();
    var menuHeight = SelectMenu.getMenuHeight(menu);
    var menuX = Math.floor((game.width - BattleMenu.WIDTH) / 2);
    var menuY = Math.floor((game.height - menuHeight) / 2);
    var selectMenu = new SelectMenu(game, menuX, menuY, BattleMenu.WIDTH, menu);

    game.stage.addChild(selectMenu);

    selectMenu.onClick('retreat', function() {
        this.game.state.start(SelectOptions.NAME, undefined, undefined, [
            {
                key: 'retreat',
                text: 'RETREAT',
                callback: this._battleScreen.stop.bind(this._battleScreen)
            },
            {
                key: 'cancel',
                text: 'CANCEL',
                callback: game.stateUtil.back.bind(game.stateUtil)
            }
        ]);
    }, this);

    this._selectMenu = selectMenu;
};

BattleMenu.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._selectMenu.destroy();
};

module.exports = BattleMenu;
