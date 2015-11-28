'use strict';

var Navicon = require('../components/navicon');
var MoveMenu = require('./move-menu');
var TroopMenu = require('./troop-menu');
var Panel = require('../components/panel');
var textUtil = require('../utils/text-util');

function RegionNavigation(game) {
    this.game = game;
}

RegionNavigation.NAME = 'region-navigation';

RegionNavigation.prototype.init = function(troopPoint, commanderKey) {
    this._troopPoint = troopPoint || this._troopPoint;
    this._commanderKey = commanderKey || this._commanderKey;
};

RegionNavigation.prototype.create = function() {
    var game = this.game;
    var troopPoint = this._troopPoint;
    var commanderKey = this._commanderKey;
    var region = game.gameState.currentRegion;
    var navicon;

    this._createInfoPanel();

    region.onClick.add(this._handleRegionClick, this);

    if (region.hasNavicon(commanderKey)) {
        return;
    }

    navicon = new Navicon(game, commanderKey, troopPoint.x, troopPoint.y);
    navicon.events.onInputDown.add(function(navicon) {
        var troop = game.gameState.troops[navicon.name];

        if (troop.isRetreating) {
            return;
        }

        game.state.start(TroopMenu.NAME, undefined, undefined, {x: navicon.x, y: navicon.y}, commanderKey);
    });
    region.addNavicon(navicon);
};

RegionNavigation.prototype._handleRegionClick = function(e) {
    if (e && e.point) {
        this.game.state.start(MoveMenu.NAME, undefined, undefined, this._commanderKey, this._troopPoint, e.point);
    }
};

RegionNavigation.prototype._createInfoPanel = function() {
    var game = this.game;
    var infoPanel = new Panel(game, 10, 349, 244, 46);
    textUtil.renderText(game, Panel.X_PADDING, 3, 'Select destination', { scale: 1.5, type: 'value', parent: infoPanel });

    game.stage.addChild(infoPanel);
    this._infoPanel = infoPanel;
};

RegionNavigation.prototype.shutdown = function() {
    var region = this.game.gameState.currentRegion;
    region.onClick.remove(this._handleRegionClick, this);
    this._infoPanel.destroy();
};

module.exports = RegionNavigation;
