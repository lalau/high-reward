'use strict';

var TroopInfoScreen = require('../screens/troop-info/troop-info-screen');
var OverlayState = require('./overlay-state');

function TroopInfo(game) {
    OverlayState.call(this, game);

    this.game = game;
}

TroopInfo.prototype = Object.create(OverlayState.prototype);

TroopInfo.NAME = 'troop-info';

TroopInfo.prototype.init = function(commanderKey) {
    var game = this.game;
    this._troop = game.gameState.troops[commanderKey];
};

TroopInfo.prototype.create = function() {
    var game = this.game;

    OverlayState.prototype.create.call(this);

    this._screen = game.stage.addChild(new TroopInfoScreen(game, this._troop));
};

TroopInfo.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._screen.destroy();
};

module.exports = TroopInfo;