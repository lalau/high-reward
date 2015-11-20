'use strict';

var SelectMenu = require('../menus/select-menu');
var StoreMenu = require('./store-menu');
var OverlayState = require('./overlay-state');

function StationMenu(game) {
    OverlayState.call(this, game);

    this.game = game;
}

StationMenu.prototype = Object.create(OverlayState.prototype);

StationMenu.NAME = 'station-menu';

StationMenu.WIDTH = 124;

StationMenu.prototype.init = function(troopPoint, commanderKey) {
    this._troopPoint = troopPoint || this._troopPoint;
    this._commanderKey = commanderKey || this._commanderKey;
};

StationMenu.prototype._getMenu = function() {
    var menu = {
        title: 'TROOP',
        options: [
            { key: 'store', text: 'GO TO STORE' }
        ]
    };

    return menu;
};

StationMenu.prototype.create = function() {
    OverlayState.prototype.create.call(this);

    var game = this.game;
    var commanderKey = this._commanderKey;
    var troopPoint = this._troopPoint;
    var y = troopPoint.y - 20;
    var selectMenu = new SelectMenu(game, troopPoint.x - StationMenu.WIDTH / 2, y, StationMenu.WIDTH, this._getMenu());

    game.stage.addChild(selectMenu);

    selectMenu.onClick('store', function() {
        game.state.start(StoreMenu.NAME, undefined, undefined, commanderKey);
    });

    this._selectMenu = selectMenu;
};

StationMenu.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._selectMenu.destroy();
};

module.exports = StationMenu;
