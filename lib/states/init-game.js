'use strict';

var AssetLoader = require('../asset-loader');
var StateUtil = require('../utils/state-util');
var assetLoaded = false;

function InitGame(game) {
    this.game = game;
    game.stateUtil = new StateUtil(game);
}

InitGame.NAME = 'init-game';

InitGame.prototype.init = function(done) {
    this._done = done;
};

InitGame.prototype.preload = function() {
    var assetLoader;

    if (!assetLoaded) {
        assetLoader = new AssetLoader(this.game, '../assets/');
        assetLoader.load();
        assetLoaded = true;
    }
};

InitGame.prototype.create = function() {
    if (this._done) {
        this._done();
    }
};

module.exports = InitGame;
