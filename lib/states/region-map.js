'use strict';

var Region = require('../components/region');
var Information = require('./information');
var battleUtil = require('../utils/battle-util');
var timeUtil = require('../utils/time-util');
var textUtil = require('../utils/text-util');
var _ = {
    forEach: require('lodash/collection/forEach')
};

function RegionMap(game) {
    this.game = game;
}

RegionMap.NAME = 'region-map';

RegionMap.prototype.create = function() {
    var game = this.game;
    var region = game.gameState.currentRegion;

    region.onClick.add(this._handleRegionClick, this);

    if (this._regionName === region.getName()) {
        return;
    }

    this._renderClock();
    this._renderMoney();

    this._regionName = region.getName();
};

RegionMap.prototype._renderClock = function() {
    var game = this.game;
    var region = game.gameState.currentRegion;

    this._clockPointer = region.addChild(new Phaser.Sprite(game, 17, 285, 'clock', timeUtil.getPointerFrame(game)));
    this._dateText = textUtil.renderText(game, 64, 386, timeUtil.getFormattedDate(game), {
        parent: region, type: 'value', scale: 1, align: 'center'
    });
};

RegionMap.prototype._renderMoney = function() {
    var game = this.game;
    var gameState = game.gameState;
    var region = game.gameState.currentRegion;
    var keyConfig = { parent: region, type: 'value', scale: 1.5 };
    var valueConfig = { parent: region, type: 'value', scale: 1.5, align: 'right' };

    textUtil.renderText(game, 480, 322, 'DEBT:', keyConfig);
    this._debtText = textUtil.renderText(game, 624, 322, gameState.debt, valueConfig);

    textUtil.renderText(game, 480, 342, 'PAY :', keyConfig);
    this._payText = textUtil.renderText(game, 624, 342, gameState.pay, valueConfig);

    textUtil.renderText(game, 480, 375, 'BANK:', keyConfig);
    this._bankText = textUtil.renderText(game, 624, 375, gameState.bank, valueConfig);
};

RegionMap.prototype._handleRegionClick = function(e) {
    var game = this.game;

    if (e.type === 'poi') {
        if (e.poi.type === 'city' || e.poi.type === 'stronghold') {
            game.state.start(CityMenu.NAME, undefined, undefined, e.poi);
        }
    }
};

RegionMap.prototype.update = function() {
    this._updateClock();
    this._updateTroop();
    this._updateMoney();
    this._updatePoi();
};

RegionMap.prototype._updateClock = function() {
    var game = this.game;

    if (this._lastClockUpdateTime && this._lastClockUpdateTime + 1000 > Date.now()) {
        return;
    }

    timeUtil.incrementHour(game);
    this._clockPointer.frame = timeUtil.getPointerFrame(game);

    var worldDate = timeUtil.getFormattedDate(game);

    if (this._dateText.text !== worldDate) {
        this._dateText.setText(worldDate);
    }

    this._lastClockUpdateTime = Date.now();
};

RegionMap.prototype._updateTroop = function() {
    if (this._lastTroopUpdateTime && this._lastTroopUpdateTime + 200 > Date.now()) {
        return;
    }

    var game = this.game;
    var gameState = game.gameState;
    var region = gameState.currentRegion;
    var stopUpdatingTroops;

    _.forEach(gameState.troops, function(troop, key) {
        var movements = troop.movements;
        var navicon;
        var nextPoint;
        var poi;

        if (!stopUpdatingTroops && movements) {
            navicon = region.getNavicon(key);

            if (movements.length > 0) {
                troop.poi = undefined;
                nextPoint = movements.shift();
                navicon.moveTo(nextPoint.x, nextPoint.y);
                this._lastTroopUpdateTime = Date.now();
                poi = region.getPoiByPoint(navicon.x, navicon.y);
                if (poi) {
                    troop.lastPoi = poi;
                }
            }

            if (movements.length === 0) {
                troop.movements = undefined;
                poi = region.getPoiByPoint(navicon.x, navicon.y);
                if (poi) {
                    region.removeNavicon(navicon);
                    troop.poi = poi.key;
                    troop.lastPoi = undefined;
                    troop.isRetreating = false;
                    this._showArrivalInfo(troop, poi.name);
                    stopUpdatingTroops = true;
                }
            } else if (this._encounterBattle(troop)) {
                stopUpdatingTroops = true;
            }
        }
    }, this);
};

RegionMap.prototype._updateMoney = function() {
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

RegionMap.prototype._updatePoi = function() {
    var game = this.game;
    var gameState = game.gameState;
    var region = gameState.currentRegion;
    var flags = {};

    _.forEach(gameState.troops, function(troop) {
        if (troop.poi) {
            flags[troop.poi] = Region.FRIENDLY;
        }
    });

    region.renderFlags(flags);
};

RegionMap.prototype._showArrivalInfo = function(troop, name) {
    this.game.state.start(Information.NAME, undefined, undefined, {
        speaker: troop.commander.key,
        key: 'arrival',
        config: {
            name: name
        }
    });
};

RegionMap.prototype._showEncounterInfo = function(troop, done) {
    this.game.state.start(Information.NAME, undefined, undefined, {
        speaker: troop.commander.key,
        key: 'enemy-encounter',
        config: {
            name: 'Prendergast Bandits'
        }
    }, done);
};

RegionMap.prototype._encounterBattle = function(troop) {
    if (troop.isRetreating) {
        return false;
    }

    var game = this.game;
    var regionalTroop;

    troop.peacefulRounds = troop.peacefulRounds || 0;
    troop.peacefulRounds++;

    if (troop.peacefulRounds > 20 && Math.random() < troop.peacefulRounds / 1000) {
        troop.peacefulRounds = 0;
        regionalTroop = battleUtil.getRegionalTroop(game.gameState.currentRegion);
        this._showEncounterInfo(troop, function() {
            game.state.start(Battle.NAME, undefined, undefined, regionalTroop, troop);
        });
        return true;
    }
};

RegionMap.prototype.shutdown = function() {
    var region = this.game.gameState.currentRegion;
    region.onClick.remove(this._handleRegionClick, this);
};

module.exports = RegionMap;

var CityMenu = require('./city-menu');
var Battle = require('./battle');
