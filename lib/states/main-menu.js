'use strict';

var RegionNavigation = require('./region-navigation');
var MainSelectMenu = require('../menus/main-select-menu');
var gameStateUtil = require('../utils/game-state-util');

function MainMenu(game) {
    this.game = game;
}

MainMenu.NAME = 'main-menu';

MainMenu.prototype.create = function() {
    var game = this.game;
    var selectMenu = new MainSelectMenu(game, 258, 145);
    var backgroundImage = game.add.image(0, 0, 'background');

    game.add.existing(selectMenu);

    selectMenu.onClick('newGame', function() {
        selectMenu.destroy();
        backgroundImage.destroy();
        game.gameState = gameStateUtil.getNewState();
        game.state.start(RegionNavigation.NAME, undefined, undefined, game.gameState.currentRegion);
    });

    game.add.group();
};

module.exports = MainMenu;
