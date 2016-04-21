'use strict';

var timeUtil = require('../../utils/time-util');
var textUtil = require('../../utils/text-util');
var tweenUtil = require('../../utils/tween-util');
var Button = require('../../components/button');
var Region = require('../../components/region');
var Navicon = require('../../components/navicon');
var _ = {
    forEach: require('lodash/collection/forEach')
};

function RegionScreen(game, regionName, troops, callback) {
    Phaser.Group.call(this, game, null, 'region-screen');

    this._renderRegion(regionName, troops, callback);
    this._renderMenu();
    this._renderClock();
    this._renderMoney();

    this.onMenuClick = new Phaser.Signal();
    this.onRegionClick = this._region.onClick;
}

RegionScreen.prototype = Object.create(Phaser.Group.prototype);

RegionScreen.prototype.update = function() {
    this._updateMoney();
};

RegionScreen.prototype._renderRegion = function(regionName, troops, callback) {
    var game = this.game;
    var region = new Region(game, regionName);

    this._region = tweenUtil.fadeIn(this.addChild(region), callback);

    _.forEach(troops, function(troop) {
        var commanderKey = troop.commander.key;
        var troopPoint;

        if (troop.movements) {
            troopPoint = troop.movements[0];
            region.addNavicon(new Navicon(game, commanderKey, troopPoint.x, troopPoint.y));
        }
    });
};

RegionScreen.prototype._renderClock = function() {
    var game = this.game;

    this._clockPointer = this.addChild(new Phaser.Sprite(game, 17, 285, 'sprites', timeUtil.getPointerFrame(game)));
    this._dateText = textUtil.renderText(game, 64, 386, timeUtil.getFormattedDate(game), {
        parent: this._region, type: 'value', scale: 1, align: 'center'
    });
};

RegionScreen.prototype.updateClock = function() {
    var game = this.game;

    if (this._lastClockUpdateTime && this._lastClockUpdateTime + 1000 > Date.now()) {
        return;
    }

    timeUtil.incrementHour(game);
    this._clockPointer.frameName = timeUtil.getPointerFrame(game);

    var worldDate = timeUtil.getFormattedDate(game);

    if (this._dateText.text !== worldDate) {
        this._dateText.setText(worldDate);
    }

    this._lastClockUpdateTime = Date.now();
};

RegionScreen.prototype._renderMoney = function() {
    var game = this.game;
    var region = this._region;
    var gameState = game.gameState;
    var keyConfig = { parent: region, type: 'value', scale: 1.5 };
    var valueConfig = { parent: region, type: 'value', scale: 1.5, align: 'right' };

    textUtil.renderText(game, 480, 322, 'DEBT:', keyConfig);
    this._debtText = textUtil.renderText(game, 624, 322, gameState.debt, valueConfig);

    textUtil.renderText(game, 480, 342, 'PAY :', keyConfig);
    this._payText = textUtil.renderText(game, 624, 342, gameState.pay, valueConfig);

    textUtil.renderText(game, 480, 375, 'BANK:', keyConfig);
    this._bankText = textUtil.renderText(game, 624, 375, gameState.bank, valueConfig);
};

RegionScreen.prototype._updateMoney = function() {
    var gameState = this.game.gameState;

    if (this._debtText.text !== gameState.debt) {
        this._debtText.setText(gameState.debt);
    }

    if (this._payText.text !== gameState.pay) {
        this._payText.setText(gameState.pay);
    }

    if (this._bankText.text !== gameState.bank) {
        this._bankText.setText(gameState.bank);
    }
};

RegionScreen.prototype._renderMenu = function() {
    var game = this.game;

    this._saveButton = this.addChild(new Button(game, 600, 8, 32, 32, { border: false }));
    this._saveButton.events.onInputDown.add(function(){
        this.onMenuClick.dispatch('save');
    }, this);
};

// see if we can move this to state
RegionScreen.prototype.enableInput = function() {
    this._saveButton.enableInput();
    this._region.toggleNavicons(true);
};

RegionScreen.prototype.disableInput = function() {
    this._saveButton.disableInput();
    this._region.toggleNavicons(false);
};

RegionScreen.prototype.hideNavicon = function(key) {
    var region = this._region;
    region.removeNavicon(region.getNavicon(key));
};

RegionScreen.prototype.moveNavicon = function(key, x, y) {
    var game = this.game;
    var region = this._region;
    var navicon = region.getNavicon(key);

    if (!navicon) {
        navicon = region.addNavicon(new Navicon(game, key, x, y));
    } else {
        navicon.moveTo(x, y);
    }

    return region.getPoiByPoint(x, y);
};

RegionScreen.prototype.renderFlags = function(flags) {
    this._region.renderFlags(flags);
};

RegionScreen.prototype.renderPoi = function(poi) {
    this._region.renderPoi(poi);
};

RegionScreen.prototype.getRegionName = function() {
    return this._region.getName();
};

RegionScreen.prototype.findPath = function(startX, startY, endX, endY, callback) {
    this._region.pathfinder.findPath(startX, startY, endX, endY, callback);
};

module.exports = RegionScreen;
