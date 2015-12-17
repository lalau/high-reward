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

BattleMenu.prototype.init = function(battleScreen) {
    this._battleScreen = battleScreen || this._battleScreen;
};

BattleMenu.prototype._getMenu = function() {
    var menu = {
        title: 'COMMAND',
        options: [
            { key: 'retreat', text: 'Retreat' },
            { key: 'retreat-unit', text: 'Retreat Unit' }
        ]
    };

    return menu;
};

BattleMenu.prototype.create = function() {
    OverlayState.prototype.create.call(this);

    var game = this.game;
    var menu = this._getMenu();
    var selectMenu = new SelectMenu(game, 'center', 'center', 'auto', menu);

    game.stage.addChild(selectMenu);

    selectMenu.onClick('retreat', function() {
        this.game.state.start(SelectOptions.NAME, undefined, undefined, 'pointer', 'pointer', [
            {
                key: 'retreat',
                text: 'Retreat',
                callback: this._battleScreen.stop.bind(this._battleScreen)
            },
            {
                key: 'cancel',
                text: 'Cancel',
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
