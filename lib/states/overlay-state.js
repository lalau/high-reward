'use strict';

var graphicUtil = require('../utils/graphic-util');

function OverlayState(game) {
    this.game = game;
}

OverlayState.NO_OP = function() {};

OverlayState.prototype.create = function(maskCallback, callbackContext) {
    var game = this.game;
    var clickMask = game.stage.addChild(graphicUtil.getClickMask(game));

    maskCallback = maskCallback || function() {
        game.stateUtil.back();
    };

    clickMask.events.onInputDown.add(maskCallback, callbackContext);

    this._clickMask = clickMask;
};

OverlayState.prototype.shutdown = function() {
    this._clickMask.destroy();
    this._clickMask = undefined;
};

OverlayState.prototype.maskAll = function() {
    this._clickMask.input.priorityID = 1000;
}

module.exports = OverlayState;
