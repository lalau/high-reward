'use strict';

var SelectMenu = require('../menus/select-menu');
var TroopMenu = require('./troop-menu');
var OverlayState = require('./overlay-state');
var _ = {
    forEach: require('lodash/collection/forEach')
};

function CityMenu(game) {
    OverlayState.call(this, game);

    this.game = game;
}

CityMenu.prototype = Object.create(OverlayState.prototype);

CityMenu.NAME = 'city-menu';

CityMenu.WIDTH = 250;

CityMenu.prototype._getMenuConfig = function() {
    var game = this.game;
    var poi = this._poi;
    var config = {
        title: poi.name,
        options: []
    };

    _.forEach(game.gameState.troops, function(troop) {
        if (troop.poi === poi.key && troop.commander.key === 'moro') {
            config.options.push({ key: troop.commander.key, text: troop.getName() });
        }
    });

    return config;
};

CityMenu.prototype.init = function(poi) {
    this._poi = poi || this._poi;
};

CityMenu.prototype.create = function() {
    OverlayState.prototype.create.call(this);

    var game = this.game;
    var poi = this._poi;
    var y = poi.y - 20;
    var selectMenu = new SelectMenu(game, poi.x - CityMenu.WIDTH / 2, y, CityMenu.WIDTH, this._getMenuConfig());

    game.stage.addChild(selectMenu);

    selectMenu.onClick('moro', function() {
        game.state.start(TroopMenu.NAME, undefined, undefined, poi, 'moro');
    });

    this._selectMenu = selectMenu;
};

CityMenu.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._selectMenu.destroy();
};


module.exports = CityMenu;
