'use strict';

var STATES = require('../../configs/states');

function StateUtil(game) {
    this.game = game;
    this._stack = [];

    if (game) {
        game.state.onStateChange.add(this.handleStateChange, this);
    }
}

StateUtil.prototype.back = function() {
    this.game.state.start(this._stack[this._stack.length - 2]);
};

StateUtil.prototype.handleStateChange = function(newState) {
    var stack = this._stack;
    var indexOfNewState = stack.indexOf(newState);

    if (indexOfNewState >= 0) {
        stack.length = indexOfNewState + 1;
    } else {
        stack.push(newState);
    }
};

StateUtil.prototype.loadStates = function() {
    var game = this.game;

    game.state.add(STATES.Battle, require('../states/battle'));
    game.state.add(STATES.BattleMenu, require('../states/battle-menu'));
    game.state.add(STATES.BattleSelectUnit, require('../states/battle-select-unit'));
    game.state.add(STATES.Bulletin, require('../states/bulletin'));
    game.state.add(STATES.CityInfo, require('../states/city-info'));
    game.state.add(STATES.CityMenu, require('../states/city-menu'));
    game.state.add(STATES.Collector, require('../states/collector'));
    game.state.add(STATES.Conversation, require('../states/conversation'));
    game.state.add(STATES.Information, require('../states/information'));
    game.state.add(STATES.InitGame, require('../states/init-game'));
    game.state.add(STATES.MainMenu, require('../states/main-menu'));
    game.state.add(STATES.MoveMenu, require('../states/move-menu'));
    game.state.add(STATES.RegionMap, require('../states/region-map'));
    game.state.add(STATES.RegionNavigation, require('../states/region-navigation'));
    game.state.add(STATES.SelectOptions, require('../states/select-options'));
    game.state.add(STATES.StationMenu, require('../states/station-menu'));
    game.state.add(STATES.StoreMenu, require('../states/store-menu'));
    game.state.add(STATES.Store, require('../states/store'));
    game.state.add(STATES.TroopFormation, require('../states/troop-formation'));
    game.state.add(STATES.TroopInfo, require('../states/troop-info'));
    game.state.add(STATES.TroopMenu, require('../states/troop-menu'));
};

module.exports = StateUtil;
