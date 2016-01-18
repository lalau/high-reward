'use strict';

var STATES = require('../../configs/states');
var Navicon = require('../components/navicon');
var tweenUtil = require('../utils/tween-util');
var _ = {
    forEach: require('lodash/collection/forEach')
};

function InitRegion(game) {
    this.game = game;
}

InitRegion.prototype.create = function() {
    this._createRegion();
};

InitRegion.prototype._createRegion = function() {
    var game = this.game;
    var currentRegion = game.gameState.currentRegion;

    if (this._regionName === currentRegion.getName() && game.stage.children.indexOf(currentRegion) >= 0) {
        this._nextState();
        return;
    }

    this._regionName = currentRegion.getName();

    // need to support replacing with new region and destroying old region
    game.stage.addChild(currentRegion);

    _.forEach(game.gameState.troops, function(troop) {
        var commanderKey = troop.commander.key;
        var troopPoint;

        if (troop.movements) {
            troopPoint = troop.movements[0];
            currentRegion.addNavicon(new Navicon(game, commanderKey, troopPoint.x, troopPoint.y));
        }
    });

    tweenUtil.fadeIn(currentRegion, this._nextState.bind(this));
};

InitRegion.prototype._nextState = function() {
    var game = this.game;

    if (game.gameState.introduced) {
        game.state.start(STATES.RegionMap);
        return;
    }

    game.state.start(STATES.Conversation, undefined, undefined, {
        scriptKey: 'introduction'
    });

    game.gameState.introduced = true;
};

module.exports = InitRegion;
