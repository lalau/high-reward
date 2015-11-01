'use strict';

var Navicon = require('../components/navicon');
var Region = require('../components/region');
var grid = require('../../configs/maps/zelerd/grid');
var pois = require('../../configs/maps/zelerd/poi');
var Conversation = require('../states/conversation');

function RegionNavigation(game) {
    this.game = game;
}

RegionNavigation.NAME = 'region-navigation';

RegionNavigation.prototype.init = function(regionName) {
    this._regionName = this.game.gameState.currentRegion;
};

RegionNavigation.prototype.create = function() {
    var game = this.game;
    var navicon = new Navicon(game, 'moro', 352, 310);

    this._navicons = {
        moro: navicon
    };

    this._currentNavicon = 'moro';
    this.getCurrentNavicon = function() {
        return this._navicons[this._currentNavicon];
    };

    this._actionQueue = [];
    this.clearActionQueue = function() {
        this._actionQueue = [];
    };
    this.scheduleAction = function(action) {
        this._actionQueue.push(action);
    };

    var region = new Region(game, 'zelerd', grid, pois);
    region.addChild(navicon);
    game.stage.addChild(region);

    this._handleIntroduction();
};

RegionNavigation.prototype._handleIntroduction = function() {
    var game = this.game;

    if (game.gameState.introduced) {
        return;
    }

    game.state.start(Conversation.NAME, undefined, undefined, {
        scriptKey: 'introduction',
        done: function() {
            game.state.start(RegionNavigation.NAME)
        }
    });
    game.gameState.introduced = true;
};

RegionNavigation.prototype.update = function() {
    var action = this._actionQueue.shift();

    if (action) {
        action();
    }
};

module.exports = RegionNavigation;
