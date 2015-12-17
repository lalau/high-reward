'use strict';

var SelectMenu = require('../menus/select-menu');
var gameStateUtil = require('../utils/game-state-util');
var InitRegion = require('./init-region');

function MainMenu(game) {
    this.game = game;
}

MainMenu.NAME = 'main-menu';

// MainMenu.X = 258;
// MainMenu.Y = 145;
MainMenu.MENU = {
    title: 'MAIN MENU',
    options: [
        { key: 'new-game', text: 'New Game' }
    ]
};

MainMenu.prototype.create = function() {
    var game = this.game;
    var selectMenu = new SelectMenu(game, 'center', 'center', 'auto', MainMenu.MENU);
    var backgroundImage = game.add.image(0, 0, 'background');

    game.stage.addChild(selectMenu);

    selectMenu.onClick('new-game', function() {
        selectMenu.destroy();
        backgroundImage.destroy();
        game.gameState = gameStateUtil.getNewState(game);
        game.state.start(InitRegion.NAME);
    });
};

module.exports = MainMenu;
