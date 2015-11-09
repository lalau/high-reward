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

    game.load.image('battlefield', root + 'components/battlefield.png');
    game.load.image('background', root + 'components/background.png');

    game.load.image('formation-icon', root + 'icons/formation.png');
    game.load.image('tactic-icon', root + 'icons/tactic.png');
    game.load.image('weapon-icon', root + 'icons/weapon.png');
    game.load.image('protection-icon', root + 'icons/protection.png');
    game.load.image('item-icon', root + 'icons/item.png');
    game.load.image('member-icon', root + 'icons/member.png');

    game.load.spritesheet('die', root + 'spritesheets/die.png', 63, 34, 5);
    game.load.spritesheet('hit', root + 'spritesheets/hit.png', 34, 33, 3);
    game.load.spritesheet('miss', root + 'spritesheets/miss.png', 10, 8, 3);
    game.load.spritesheet('infantry-side', root + 'spritesheets/infantry-side.png', 64, 32, 2);
    game.load.spritesheet('armoured-infantry-side', root + 'spritesheets/armoured-side.png', 64, 32, 2);
    game.load.spritesheet('mechanized-infantry-side', root + 'spritesheets/mech-side.png', 64, 32, 2);
    game.load.spritesheet('heavy-infantry-side', root + 'spritesheets/heavy-side.png', 64, 32, 2);
    game.load.spritesheet('moro-side', root + 'spritesheets/moro-side.png', 64, 32, 2);

    game.load.spritesheet('clock', root + 'spritesheets/clock.png', 82, 82, 13);

    new Phaser.Text(game, 0, 0, ' ', {font: '1px Topaz-8'});
};

module.exports = AssetLoader;
