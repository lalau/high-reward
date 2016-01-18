'use strict';

var TroopFormationScreen = require('../screens/troop-formation/troop-formation-screen');
var OverlayState = require('./overlay-state');
var tweenUtil = require('../utils/tween-util');

function TroopFormation(game) {
    OverlayState.call(this, game);

    this.game = game;
}

TroopFormation.prototype = Object.create(OverlayState.prototype);

TroopFormation.prototype.init = function(commanderKey) {
    var game = this.game;
    this._troop = game.gameState.troops[commanderKey];
};

TroopFormation.prototype.create = function() {
    var game = this.game;

    OverlayState.prototype.create.call(this);

    this._screen = tweenUtil.fadeIn(game.stage.addChild(new TroopFormationScreen(game, this._troop)));
};

TroopFormation.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._screen.destroy();
};

module.exports = TroopFormation;
