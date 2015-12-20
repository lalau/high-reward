'use strict';

function AssetLoader(game, root) {
    this._config = {
        game: game,
        root: root
    };
}

AssetLoader.prototype.load = function() {
    var game = this._config.game;
    var root = this._config.root;

    game.load.atlasJSONHash('icons', root + 'build/icons.png', root + 'build/icons.json');
    game.load.atlasJSONHash('portraits', root + 'build/portraits.png', root + 'build/portraits.json');
    game.load.atlasJSONHash('screens', root + 'build/screens.png', root + 'build/screens.json');
    game.load.atlasJSONHash('sprites', root + 'build/sprites.png', root + 'build/sprites.json');
    new Phaser.Text(game, 0, 0, ' ', {font: '1px Topaz-8'});
};

module.exports = AssetLoader;
