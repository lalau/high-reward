'use strict';

var AssetLoader = require('../asset-loader');
var MainMenu = require('./main-menu');

function InitGame(game) {
    this.game = game;
}

InitGame.NAME = 'init-game';

InitGame.prototype.init = function(nextState) {
    this._nextState = nextState;
};

InitGame.prototype.preload = function() {
    var assetLoader = new AssetLoader(this.game, '../assets/');
    assetLoader.load();
};

InitGame.prototype.create = function() {
    if (this._nextState) {
        this.game.state.start(this._nextState);
    }
};

module.exports = InitGame;
