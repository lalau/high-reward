'use strict';

var STATES = require('../../configs/states');
var Region = require('../components/region');
var RegionScreen = require('../screens/region-map/region-screen');
var battleUtil = require('../utils/battle-util');
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
    var gameState = game.gameState;

    if (this._regionScreen) {
        this._regionScreen.enableInput();
        return;
    }

    this._regionScreen = game.stage.addChild(new RegionScreen(game, gameState.currentRegion, gameState.troops, this._introduce.bind(this)));
    this._regionScreen.onMenuClick.add(this._handleMenuClick, this);
    this._regionScreen.onRegionClick.add(this._handleRegionClick, this);
    this._updatePoi();
};

RegionMap.prototype._introduce = function() {
    var game = this.game;

    if (game.gameState.introduced) {
        return;
    }

    game.gameState.introduced = true;
    game.state.start(STATES.Conversation, undefined, undefined, {
        scriptKey: 'introduction'
    });
};

RegionMap.prototype._handleMenuClick = function(key) {
    var game = this.game;

    if (key === 'save') {
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
    }
};

RegionMap.prototype._handleRegionClick = function(e) {
    var game = this.game;

    if (e.type === 'poi') {
        if (e.poi.type === 'city' || e.poi.type === 'stronghold' || e.poi.type === 'capital') {
            game.state.start(STATES.CityMenu, undefined, undefined, e.poi);
        }
    }
};

RegionMap.prototype.update = function() {
    if (!this.game.gameState.introduced) {
        return;
    }

    this._regionScreen.updateClock();
    this._updateTroops();
    this._updatePoi();
    this._updateWork();
    this._updateCollector();
    this._paySalary();
};

RegionMap.prototype._updateTroops = function() {
    if (this._lastTroopUpdateTime && this._lastTroopUpdateTime + 200 > Date.now()) {
        return;
    }

    var gameState = this.game.gameState;
    var stopUpdatingTroops;

    _.forEach(gameState.troops, function(troop, key) {
        var movements = troop.movements;
        var nextPoint;

        if (!stopUpdatingTroops && movements && movements.length > 0) {
            this._lastTroopUpdateTime = Date.now();
            nextPoint = this._moveTroop(key, troop);
            if (nextPoint && this._encounterBattle(troop, nextPoint.x, nextPoint.y)) {
                stopUpdatingTroops = true;
            }
        }
    }, this);
};

RegionMap.prototype._moveTroop = function(key, troop) {
    var regionScreen = this._regionScreen;
    var movements = troop.movements;
    var visitPoi;
    var nextPoint;

    if (!movements || movements.length === 0) {
        return;
    }

    troop.poi = undefined;
    nextPoint = movements.shift();
    visitPoi = regionScreen.moveNavicon(key, nextPoint.x, nextPoint.y);

    if (visitPoi) {
        troop.lastPoi = visitPoi;
    }

    if (movements.length === 0) {
        troop.movements = undefined;

        if (visitPoi) {
            regionScreen.hideNavicon(key);
            troop.poi = visitPoi.key;
            troop.lastPoi = undefined;
            troop.isRetreating = false;
            this._showArrivalInfo(troop, visitPoi.name);
        }
    } else {
        // is moving <=> is not settled
        return nextPoint;
    }
};

RegionMap.prototype._updatePoi = function() {
    var gameState = this.game.gameState;
    var regionScreen = this._regionScreen;
    var flags = {};

    _.forEach(gameState.troops, function(troop) {
        if (troop.poi) {
            flags[troop.poi] = Region.FRIENDLY;
        }
    });

    regionScreen.renderFlags(flags);

    _.forEach(gameState.regions[gameState.currentRegion].pois, function(poi) {
        regionScreen.renderPoi(poi);
    });
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

RegionMap.prototype._paySalary = function() {
    var game = this.game;
    var gameState = game.gameState;
    var worldTime = gameState.worldTime;
    var lastPaidDate = gameState.lastPaidDate;
    var total;

    if (worldTime.date() === 1 && lastPaidDate !== worldTime.format('YYYY-MM-DD')) {
        total = gameState.troops.moro.getPay();
        game.state.start(STATES.Conversation, undefined, undefined, {
            scriptKey: 'pay-salary',
            data: {
                total: total
            },
            onEnd: function() {
                gameState.bank -= total;
                gameState.lastPaidDate = worldTime.format('YYYY-MM-DD');
                game.state.start(STATES.RegionMap);
            }
        });
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

RegionMap.prototype._showEncounterInfo = function(troop, encounteredTroop, done) {
    this.game.state.start(STATES.Information, undefined, undefined, {
        speaker: troop.commander.key,
        key: 'enemy-encounter',
        config: {
            name: encounteredTroop.getName()
        }
    }, done);
};

RegionMap.prototype._encounterBattle = function(troop, x, y) {
    if (troop.isRetreating) {
        return false;
    }

    var game = this.game;
    var regionalTroop;

    troop.peacefulRounds = troop.peacefulRounds || 0;
    troop.peacefulRounds++;

    if (troop.peacefulRounds > 20 && Math.random() < troop.peacefulRounds / 1000) {
        troop.peacefulRounds = 0;
        regionalTroop = battleUtil.getRegionalTroop(this._regionScreen.getRegionName());
        this._showEncounterInfo(troop, regionalTroop, function() {
            game.state.start(STATES.Battle, undefined, undefined, regionalTroop, troop, x, y);
        });
        return true;
    }
};

RegionMap.prototype.shutdown = function() {
    this._regionScreen.disableInput();
};

module.exports = RegionMap;
