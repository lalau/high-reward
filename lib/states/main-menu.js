'use strict';

var SelectMenu = require('../menus/select-menu');
var gameStateUtil = require('../utils/game-state-util');
var InitRegion = require('./init-region');
var tweenUtil = require('../utils/tween-util');

function MainMenu(game) {
    this.game = game;
}

MainMenu.NAME = 'main-menu';

// MainMenu.X = 258;
// MainMenu.Y = 145;
MainMenu.MENU = {
    title: 'MAIN MENU',
    options: [
        { key: 'new-game', text: 'New Game' },
        { key: 'load-game', text: 'Load Game' }
    ]
};

MainMenu.prototype.create = function() {
    var game = this.game;
    var selectMenu = new SelectMenu(game, 'center', 'center', 'auto', MainMenu.MENU);
    var backgroundImage = game.add.image(0, 0, 'screens', 'background.png');

    tweenUtil.fadeIn(backgroundImage, function() {
        game.stage.addChild(selectMenu);
    });

    selectMenu.onClick('new-game', function() {
        selectMenu.destroy();
        tweenUtil.fadeOut(backgroundImage, function() {
            backgroundImage.destroy();
            game.gameState = gameStateUtil.getNewState(game);
            game.state.start(InitRegion.NAME);
        });
    });
};

module.exports = MainMenu;
