'use strict';

var InitGame = require('../lib/states/init-game');
var MainMenu = require('../lib/states/main-menu');
var RegionNavigation = require('../lib/states/region-navigation');
var RegionMap = require('../lib/states/region-map');
var Conversation = require('../lib/states/conversation');
var CityMenu = require('../lib/states/city-menu');
var TroopMenu = require('../lib/states/troop-menu');
var TroopInfo = require('../lib/states/troop-info');
var TroopFormation = require('../lib/states/troop-formation');
var InitRegion = require('../lib/states/init-region');
var MoveMenu = require('../lib/states/move-menu');
var Battle = require('../lib/states/battle');
var Information = require('../lib/states/information');
var StationMenu = require('../lib/states/station-menu');
var StoreMenu = require('../lib/states/store-menu');
var Store = require('../lib/states/store');
var BattleMenu = require('../lib/states/battle-menu');
var SelectOptions = require('../lib/states/select-options');
var Bulletin = require('../lib/states/bulletin');
var Collector = require('../lib/states/collector');
var game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);

game.state.add(InitGame.NAME, InitGame);
game.state.add(MainMenu.NAME, MainMenu);
game.state.add(RegionNavigation.NAME, RegionNavigation);
game.state.add(RegionMap.NAME, RegionMap);
game.state.add(Conversation.NAME, Conversation);
game.state.add(CityMenu.NAME, CityMenu);
game.state.add(TroopMenu.NAME, TroopMenu);
game.state.add(TroopInfo.NAME, TroopInfo);
game.state.add(TroopFormation.NAME, TroopFormation);
game.state.add(InitRegion.NAME, InitRegion);
game.state.add(MoveMenu.NAME, MoveMenu);
game.state.add(Battle.NAME, Battle);
game.state.add(Information.NAME, Information);
game.state.add(StationMenu.NAME, StationMenu);
game.state.add(StoreMenu.NAME, StoreMenu);
game.state.add(Store.NAME, Store);
game.state.add(BattleMenu.NAME, BattleMenu);
game.state.add(SelectOptions.NAME, SelectOptions);
game.state.add(Bulletin.NAME, Bulletin);
game.state.add(Collector.NAME, Collector);

game.state.start(InitGame.NAME, undefined, undefined, function() {
    game.state.start(MainMenu.NAME);
});

window.game = game;
