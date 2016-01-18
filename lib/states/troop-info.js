'use strict';

var TroopInfoScreen = require('../screens/troop-info/troop-info-screen');
var OverlayState = require('./overlay-state');
var tweenUtil = require('../utils/tween-util');

function TroopInfo(game) {
    OverlayState.call(this, game);

    this.game = game;
}

TroopInfo.prototype = Object.create(OverlayState.prototype);

TroopInfo.prototype.init = function(commanderKey) {
    var game = this.game;
    this._troop = game.gameState.troops[commanderKey];
};

TroopInfo.prototype.create = function() {
    var game = this.game;

    OverlayState.prototype.create.call(this);

    this._screen = tweenUtil.fadeIn(game.stage.addChild(new TroopInfoScreen(game, this._troop)));
};

TroopInfo.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._screen.destroy();
};

module.exports = TroopInfo;
