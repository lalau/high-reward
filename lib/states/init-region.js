'use strict';

var RegionMap = require('./region-map');
var Conversation = require('./conversation');

function InitRegion(game) {
    this.game = game;
}

InitRegion.NAME = 'init-region';

InitRegion.prototype.create = function() {
    this._createRegion();
    this._nextState();
};

InitRegion.prototype._createRegion = function() {
    var game = this.game;
    var currentRegion = game.gameState.currentRegion;

    if (this._regionName === currentRegion.getName()) {
        return;
    }

    // need to support replacing with new region and destroying old region
    game.stage.addChild(currentRegion);

    this._regionName = currentRegion.getName();
};

InitRegion.prototype._nextState = function() {
    var game = this.game;

    if (game.gameState.introduced) {
        game.state.start(RegionMap.NAME);
        return;
    }

    game.state.start(Conversation.NAME, undefined, undefined, {
        scriptKey: 'introduction'
    });

    game.gameState.introduced = true;
};

module.exports = InitRegion;
