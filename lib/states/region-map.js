'use strict';

var STATES = require('../../configs/states');
var Region = require('../components/region');
var Button = require('../components/button');
var battleUtil = require('../utils/battle-util');
var timeUtil = require('../utils/time-util');
var textUtil = require('../utils/text-util');
var gameStateUtil = require('../utils/game-state-util');
var Collector = require('./collector');
var _ = {
    forEach: require('lodash/collection/forEach')
};

function RegionMap(game) {
    this.game = game;
}

RegionMap.prototype.create = function() {
    var game = this.game;
    var region = game.gameState.currentRegion;

    region.onClick.add(this._handleRegionClick, this);
    this._renderButtons();
    region.toggleNavicons(true);

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

    this._clockPointer = region.addChild(new Phaser.Sprite(game, 17, 285, 'sprites', timeUtil.getPointerFrame(game)));
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

RegionMap.prototype._renderButtons = function() {
    var game = this.game;
    var region = game.gameState.currentRegion;
    var saveButton = region.addChild(new Button(game, 600, 8, 32, 32, { border: false }));

    saveButton.events.onInputDown.add(function(){
        game.state.start(STATES.SelectOptions, undefined, undefined, 'pointer', 'pointer', [
            {
                key: 'save',
                text: 'SAVE',
                callback: function() {
                    window.localStorage.setItem('gameState', JSON.stringify(gameStateUtil.dehydrate(game.gameState)));
                    game.state.start(STATES.RegionMap);
                }
            },
            {
                key: 'cancel',
                text: 'CANCEL',
                callback: function() {
                    game.state.start(STATES.RegionMap);
                }
            }
        ]);
    }, this);

    this._buttons = [saveButton];
};

RegionMap.prototype._handleRegionClick = function(e) {
    var game = this.game;

    if (e.type === 'poi') {
        if (e.poi.type === 'city' || e.poi.type === 'stronghold') {
            game.state.start(STATES.CityMenu, undefined, undefined, e.poi);
        }
    }
};

RegionMap.prototype.update = function() {
    this._updateClock();
    this._updateTroop();
    this._updateMoney();
    this._updatePoi();
    this._updateWork();
    this._updateCollector();
};

RegionMap.prototype._updateClock = function() {
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

RegionMap.prototype._updateWork = function() {
    var game = this.game;
    var gameState = game.gameState;
    var works = gameState.works;
    var troops = gameState.troops;
    var currentDate = gameState.worldTime.date();
    var isCompleted;
    var endedWork;

    works.some(function(work, i) {
        if (troops[work.commanderKey].poi === work.destination) {
            isCompleted = true;
        } else if (work.updatedDate !== currentDate) {
            work.updatedDate = currentDate;
            work.days--;
            if (work.days <= 0) {
                isCompleted = false;
            }
        }
        if (isCompleted !== undefined) {
            endedWork = works.splice(i, 1)[0];
            return true;
        }
    });

    if (endedWork) {
        game.state.start(STATES.Conversation, undefined, undefined, {
            scriptGroup: 'works',
            scriptKey: endedWork.work + (isCompleted ? '-completed' : '-failed'),
            speaker: {
                name: endedWork.name,
                portrait: endedWork.portrait
            },
            position: 'top',
            data: {
                reward: endedWork.reward,
                penalty: endedWork.penalty
            },
            onEnd: function() {
                if (isCompleted) {
                    gameState.bank += endedWork.reward;
                } else {
                    gameState.bank -= endedWork.penalty;
                }
                game.stateUtil.back();
            }
        });
    }
};

RegionMap.prototype._updateCollector = function() {
    var game = this.game;
    var gameState = game.gameState;
    var worldTime = gameState.worldTime;
    var action;

    if (!gameState.collectorIntroduced && worldTime.diff(Collector.INTRODUCE_DATE) >= 0) {
        action = 'introduce';
    } else if (gameState.collectorIntroduced && worldTime.diff(gameState.nextCollectDate) >= 0) {
        action = 'collect';
    }

    if (action) {
        game.state.start(STATES.Collector, undefined, undefined, action);
    }
};

RegionMap.prototype._showArrivalInfo = function(troop, name) {
    this.game.state.start(STATES.Information, undefined, undefined, {
        speaker: troop.commander.key,
        key: 'arrival',
        config: {
            name: name
        }
    });
};

RegionMap.prototype._showEncounterInfo = function(troop, done) {
    this.game.state.start(STATES.Information, undefined, undefined, {
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
            game.state.start(STATES.Battle, undefined, undefined, regionalTroop, troop);
        });
        return true;
    }
};

RegionMap.prototype.shutdown = function() {
    var region = this.game.gameState.currentRegion;

    region.onClick.remove(this._handleRegionClick, this);
    this._buttons.forEach(function(button) {
        button.destroy();
    });
    region.toggleNavicons(false);
};

module.exports = RegionMap;
