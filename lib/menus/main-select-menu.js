'use strict';

var SelectMenu = require('./select-menu');

function MainSelectMenu(game, x, y) {
    SelectMenu.call(this, game, x, y, MainSelectMenu.WIDTH, MainSelectMenu.MENU);
}

MainSelectMenu.prototype = Object.create(SelectMenu.prototype);

MainSelectMenu.WIDTH = 124;
MainSelectMenu.MENU = {
    title: 'MAIN MENU',
    options: [
        { key: 'newGame', text: 'NEW GAME' }
    ]
};

module.exports = MainSelectMenu;
