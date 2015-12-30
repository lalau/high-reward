'use strict';

var assetsConfig = require('../build/assets/assets');
// to be compiled by grunt task into
// var hrEnv = {isProd: true};
var hrEnv = {/*hrEnv*/};

function AssetLoader(game) {
    this._config = {
        game: game,
        root: hrEnv.isProd ? assetsConfig.host : '/build'
    };
}

AssetLoader.prototype.load = function() {
    var game = this._config.game;
    var root = this._config.root + '/assets/images/';
    var spritesheetConfig = assetsConfig.spritesheets;

    game.load.crossOrigin = 'anonymous';
    game.load.atlasJSONHash('icons', root + 'icons.' + spritesheetConfig.icons.spritesheet + '.png', undefined, require('../build/assets/images/icons.json'));
    game.load.atlasJSONHash('portraits', root + 'portraits.' + spritesheetConfig.portraits.spritesheet + '.png', undefined, require('../build/assets/images/portraits.json'));
    game.load.atlasJSONHash('screens', root + 'screens.' + spritesheetConfig.screens.spritesheet + '.png', undefined, require('../build/assets/images/screens.json'));
    game.load.atlasJSONHash('sprites', root + 'sprites.' + spritesheetConfig.sprites.spritesheet + '.png', undefined, require('../build/assets/images/sprites.json'));

    new Phaser.Text(game, 0, 0, ' ', {font: '1px Topaz-8'});
};

module.exports = AssetLoader;
