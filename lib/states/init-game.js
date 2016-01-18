'use strict';

var AssetLoader = require('../asset-loader');

function InitGame(game) {
    this.game = game;
}

InitGame.prototype.init = function(done) {
    this._done = done;
};

InitGame.prototype.preload = function() {
    var game = this.game;
    var assetLoader;

    if (!game.assetLoaded) {
        assetLoader = new AssetLoader(this.game);
        assetLoader.load();
        game.assetLoaded = true;
    }
};

InitGame.prototype.create = function() {
    if (this._done) {
        this._done();
    }
};

module.exports = InitGame;
