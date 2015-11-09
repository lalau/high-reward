'use strict';

var SelectMenu = require('../menus/select-menu');
var TroopInfo = require('./troop-info');
var TroopFormation = require('./troop-formation');
var OverlayState = require('./overlay-state');

function TroopMenu(game) {
    OverlayState.call(this, game);

    this.game = game;
}

TroopMenu.prototype = Object.create(OverlayState.prototype);

TroopMenu.NAME = 'troop-menu';

TroopMenu.WIDTH = 124;

TroopMenu.prototype.init = function(troopPoint, commanderKey) {
    this._troopPoint = troopPoint || this._troopPoint;
    this._commanderKey = commanderKey || this._commanderKey;
};

TroopMenu.prototype._getMenu = function() {
    var troop = this.game.gameState.troops[this._commanderKey];
    var menu = {
        title: 'TROOP',
        options: [
            { key: 'move', text: 'MOVE' },
            { key: 'info', text: 'INFO' },
            { key: 'formation', text: 'FORMATION' }
        ]
    };

    if (!troop.poi) {
        menu.options.push({ key: 'idle', text: 'IDLE' });
        menu.options.push({ key: 'rest', text: 'REST' });
    }

    return menu;
};

TroopMenu.prototype.create = function() {
    OverlayState.prototype.create.call(this);

    var game = this.game;
    var troopPoint = this._troopPoint;
    var commanderKey = this._commanderKey;
    var y = troopPoint.y - 20;
    var selectMenu = new SelectMenu(game, troopPoint.x - TroopMenu.WIDTH / 2, y, TroopMenu.WIDTH, this._getMenu());

    game.stage.addChild(selectMenu);

    selectMenu.onClick('info', function() {
        game.state.start(TroopInfo.NAME, undefined, undefined, commanderKey);
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
