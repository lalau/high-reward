'use strict';

var SelectMenu = require('../menus/select-menu');
var OverlayState = require('./overlay-state');
var RegionMap = require('./region-map');
var TroopMenu = require('./troop-menu');
var tweenUtil = require('../utils/tween-util');

function MoveMenu(game) {
    OverlayState.call(this, game);

    this.game = game;
}

MoveMenu.prototype = Object.create(OverlayState.prototype);

MoveMenu.NAME = 'move-menu';

MoveMenu.MENU = {
    title: 'MOVE',
    options: [
        { key: 'move', text: 'Move' },
        { key: 'cancel', text: 'Cancel' }
    ]
};

MoveMenu.prototype.init = function(commanderKey, troopPoint, menuPoint) {
    this._commanderKey = commanderKey;
    this._troopPoint = troopPoint;
    this._menuPoint = menuPoint;
};

MoveMenu.prototype.create = function() {
    OverlayState.prototype.create.call(this);

    var game = this.game;
    var menuPoint = this._menuPoint;
    var menuWidth = SelectMenu.getAutoMenuWidth(MoveMenu.MENU);
    var selectMenu = new SelectMenu(game, menuPoint.x - menuWidth / 2, menuPoint.y - 20, menuWidth, MoveMenu.MENU);

    selectMenu.onClick('move', this._prepareMove, this);
    selectMenu.onClick('cancel', this._cancelMove, this);

    tweenUtil.fadeIn(game.stage.addChild(selectMenu));
    this._selectMenu = selectMenu;
};

MoveMenu.prototype._prepareMove = function() {
    var game = this.game;
    var gameState = game.gameState;
    var region = gameState.currentRegion;
    var troopPoint = this._troopPoint;
    var menuPoint = this._menuPoint;
    var commanderKey = this._commanderKey;

    region.pathfinder.findPath(troopPoint.x, troopPoint.y, menuPoint.x, menuPoint.y, function(points) {
        gameState.troops[commanderKey].movements = points;
        game.state.start(RegionMap.NAME);
    });
};

MoveMenu.prototype._cancelMove = function() {
    var game = this.game;

    game.gameState.currentRegion.removeNavicon(this._commanderKey);
    game.state.start(TroopMenu.NAME);
};

MoveMenu.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._selectMenu.destroy();
};

module.exports = MoveMenu;
