'use strict';

var RegionMap = require('./region-map');
var BattleScreen = require('../screens/battle/battle-screen');
var Information = require('./information');
var BattleMenu = require('./battle-menu');
var OverlayState = require('./overlay-state');

function Battle(game) {
    OverlayState.call(this, game);

    this.game = game;
}

Battle.prototype = Object.create(OverlayState.prototype);

Battle.NAME = 'battle';

Battle.prototype.init = function(troop1, troop2) {
    this._troop1 = troop1;
    this._troop2 = troop2;
};

Battle.prototype.create = function() {
    OverlayState.prototype.create.call(this, this._openBattleMenu, this);

    if (this._screen) {
        this._screen.resume();
        return;
    }

    var self = this;
    var game = this.game;
    var troop1 = this._troop1;
    var troop2 = this._troop2;
    var screen = new BattleScreen(game, troop1, troop2);

    game.stage.addChild(screen);
    this._screen = screen;

    screen.onBattleEnded.add(function(wonTroopIndex) {
        setTimeout(function() {
            screen.destroy();
            self._screen = undefined;
            if (wonTroopIndex === -1) {
                self._handleRetreat();
            } else {
                self._handleWin();
            }
        }, 500);
    });

    setTimeout(function() {
        screen.start();
    }, 1000);
};

Battle.prototype._handleWin = function() {
    var game = this.game;

    game.gameState.bank += 100;
    game.state.start(Information.NAME, undefined, undefined, {
        speaker: this._troop2.commander.key,
        key: 'battle-win-hard',
        config: {
            amount: 100
        }
    }, function() {
        game.state.start(RegionMap.NAME);
    });
};

Battle.prototype._handleRetreat = function() {
    var self = this;
    var game = this.game;
    var troop = this._troop2;

    game.state.start(Information.NAME, undefined, undefined, {
        speaker: troop.commander.key,
        key: 'battle-retreat',
        config: {
            name: troop.lastPoi && troop.lastPoi.name
        }
    }, function() {
        self._prepareRetreatMove();
        game.state.start(RegionMap.NAME);
    });
};

Battle.prototype._prepareRetreatMove = function() {
    var game = this.game;
    var gameState = game.gameState;
    var region = gameState.currentRegion;
    var troop = this._troop2;
    var commanderKey = troop.commander.key;
    var navicon = region.getNavicon(commanderKey);
    var lastPoi = troop.lastPoi;

    if (!navicon || !lastPoi) {
        return;
    }

    region.pathfinder.findPath(navicon.x, navicon.y, lastPoi.x, lastPoi.y, function(points) {
        troop.isRetreating = true;
        gameState.troops[commanderKey].movements = points;
        game.state.start(RegionMap.NAME);
    });
};

Battle.prototype._openBattleMenu = function() {
    this.game.state.start(BattleMenu.NAME, undefined, undefined, this._screen);
    this._screen.pause();
};

Battle.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);
};

module.exports = Battle;
