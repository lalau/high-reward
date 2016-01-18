'use strict';

var STATES = require('../../configs/states');
var SelectMenu = require('../menus/select-menu');
var gameStateUtil = require('../utils/game-state-util');
var tweenUtil = require('../utils/tween-util');

function MainMenu(game) {
    this.game = game;
}

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

    selectMenu.onClick('new-game', this._handleMenuClick, this);

    if (window.localStorage.getItem('gameState')) {
        selectMenu.onClick('load-game', this._handleMenuClick, this);
    }

    this._selectMenu = selectMenu;
    this._backgroundImage = backgroundImage;
};

MainMenu.prototype._handleMenuClick = function(key) {
    var game = this.game;
    var backgroundImage = this._backgroundImage;
    var savedGameState = window.localStorage.getItem('gameState');

    this._selectMenu.destroy();
    tweenUtil.fadeOut(backgroundImage, function() {
        backgroundImage.destroy();
        if (key === 'load-game' && savedGameState) {
            game.gameState = gameStateUtil.rehydrate(game, JSON.parse(savedGameState));
        } else {
            game.gameState = gameStateUtil.getNewState(game);
        }
        game.state.start(STATES.InitRegion);
    });
};

module.exports = MainMenu;
