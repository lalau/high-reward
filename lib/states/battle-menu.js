'use strict';

var STATES = require('../../configs/states');
var SelectMenu = require('../menus/select-menu');
var OverlayState = require('./overlay-state');
var tweenUtil = require('../utils/tween-util');

function BattleMenu(game) {
    OverlayState.call(this, game);

    this.game = game;
}

BattleMenu.prototype = Object.create(OverlayState.prototype);

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

    tweenUtil.fadeIn(game.stage.addChild(selectMenu));

    selectMenu.onClick('retreat', function() {
        game.state.start(STATES.SelectOptions, undefined, undefined, 'pointer', 'pointer', [
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

    selectMenu.onClick('retreat-unit', function() {
        game.state.start(STATES.BattleSelectUnit, undefined, undefined, this._battleScreen);
    }, this);

    this._selectMenu = selectMenu;
};

BattleMenu.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._selectMenu.destroy();
};

module.exports = BattleMenu;
