'use strict';

var STATES = require('../../configs/states');
var Navicon = require('../components/navicon');
var Panel = require('../components/panel');
var textUtil = require('../utils/text-util');
var tweenUtil = require('../utils/tween-util');

function RegionNavigation(game) {
    this.game = game;
}

RegionNavigation.prototype.init = function(troopPoint, commanderKey) {
    this._troopPoint = troopPoint || this._troopPoint;
    this._commanderKey = commanderKey || this._commanderKey;
};

RegionNavigation.prototype.create = function() {
    var game = this.game;
    var troopPoint = this._troopPoint;
    var commanderKey = this._commanderKey;
    var region = game.gameState.currentRegion;

    this._createInfoPanel();

    region.onClick.add(this._handleRegionClick, this);

    if (region.hasNavicon(commanderKey)) {
        return;
    }

    region.addNavicon(new Navicon(game, commanderKey, troopPoint.x, troopPoint.y));
};

RegionNavigation.prototype._handleRegionClick = function(e) {
    if (e && e.point) {
        this.game.state.start(STATES.MoveMenu, undefined, undefined, this._commanderKey, this._troopPoint, e.point);
    }
};

RegionNavigation.prototype._createInfoPanel = function() {
    var game = this.game;
    var infoPanel = new Panel(game, 10, 349, 244, 46);
    textUtil.renderText(game, Panel.X_PADDING, 3, 'Select destination', { scale: 1.5, type: 'value', parent: infoPanel });

    tweenUtil.fadeIn(game.stage.addChild(infoPanel));
    this._infoPanel = infoPanel;
};

RegionNavigation.prototype.shutdown = function() {
    var region = this.game.gameState.currentRegion;
    region.onClick.remove(this._handleRegionClick, this);
    this._infoPanel.destroy();
};

module.exports = RegionNavigation;
