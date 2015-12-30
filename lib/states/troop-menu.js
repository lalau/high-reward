'use strict';

var SelectMenu = require('../menus/select-menu');
var TroopInfo = require('./troop-info');
var TroopFormation = require('./troop-formation');
var StationMenu = require('./station-menu');
var OverlayState = require('./overlay-state');
var tweenUtil = require('../utils/tween-util');

function TroopMenu(game) {
    OverlayState.call(this, game);

    this.game = game;
}

TroopMenu.prototype = Object.create(OverlayState.prototype);

TroopMenu.NAME = 'troop-menu';

TroopMenu.prototype.init = function(troopPoint, commanderKey) {
    this._troopPoint = troopPoint || this._troopPoint;
    this._commanderKey = commanderKey || this._commanderKey;
};

TroopMenu.prototype._getMenu = function() {
    var troop = this.game.gameState.troops[this._commanderKey];
    var menu = {
        title: 'TROOP',
        options: [
            { key: 'move', text: 'Move' }
        ]
    };

    if (troop.poi) {
        menu.options.push({ key: 'station', text: 'Station' });
    }

    menu.options.push({ key: 'info', text: 'Info' });
    menu.options.push({ key: 'formation', text: 'Formation' });

    if (!troop.poi) {
        menu.options.push({ key: 'idle', text: 'Idle' });
        menu.options.push({ key: 'rest', text: 'Rest' });
    }

    return menu;
};

TroopMenu.prototype.create = function() {
    OverlayState.prototype.create.call(this);

    var game = this.game;
    var troopPoint = this._troopPoint;
    var commanderKey = this._commanderKey;
    var menu = this._getMenu();
    var menuWidth = SelectMenu.getAutoMenuWidth(menu);
    var selectMenu = new SelectMenu(game, troopPoint.x - menuWidth / 2, troopPoint.y - 20, menuWidth, menu);

    tweenUtil.fadeIn(game.stage.addChild(selectMenu));

    selectMenu.onClick('info', function() {
        game.state.start(TroopInfo.NAME, undefined, undefined, commanderKey);
    });

    selectMenu.onClick('station', function() {
        game.state.start(StationMenu.NAME, undefined, undefined, troopPoint, commanderKey);
    });

    selectMenu.onClick('formation', function() {
        game.state.start(TroopFormation.NAME, undefined, undefined, commanderKey);
    });

    selectMenu.onClick('move', function() {
        game.state.start(RegionNavigation.NAME, undefined, undefined, troopPoint, commanderKey);
    });

    this._selectMenu = selectMenu;
};

TroopMenu.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._selectMenu.destroy();
};

module.exports = TroopMenu;

var RegionNavigation = require('./region-navigation');
