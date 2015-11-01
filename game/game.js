'use strict';

var InitGame = require('../lib/states/init-game');
var MainMenu = require('../lib/states/main-menu');
var RegionNavigation = require('../lib/states/region-navigation');
var Conversation = require('../lib/states/conversation');
var game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);

game.state.add(InitGame.NAME, InitGame);
game.state.add(MainMenu.NAME, MainMenu);
game.state.add(RegionNavigation.NAME, RegionNavigation);
game.state.add(Conversation.NAME, Conversation);

game.state.start(InitGame.NAME, undefined, undefined, MainMenu.NAME);
