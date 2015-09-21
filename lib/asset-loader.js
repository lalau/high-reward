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

    game.load.image('jesse-portrait', root + 'units/jesse-azeiro/portrait.png');
    game.load.image('jesse-stand', root + 'units/jesse-azeiro/stand.png');
    game.load.image('moro-portrait', root + 'units/moro-dinando/portrait.png');
    game.load.image('moro-stand', root + 'units/moro-dinando/stand.png');
    game.load.image('moro-navicon', root + 'units/moro-dinando/navicon.png');
    game.load.image('lu-portrait', root + 'units/lu-dominic/portrait.png');
    game.load.image('lu-stand', root + 'units/lu-dominic/stand.png');
    game.load.image('sal-portrait', root + 'units/sal-venia-borosman/portrait.png');
    game.load.image('sal-stand', root + 'units/sal-venia-borosman/stand.png');

    game.load.image('infantry-stand', root + 'units/infantry/stand.png');
    game.load.image('armoured-infantry-stand', root + 'units/armoured-infantry/stand.png');
    game.load.image('mechanized-infantry-stand', root + 'units/mechanized-infantry/stand.png');

    game.load.image('zelerd-map', root + 'maps/zelerd.png');

    new Phaser.Text(game, 0, 0, ' ', {font: '1px Topaz-8'});
};

module.exports = AssetLoader;
