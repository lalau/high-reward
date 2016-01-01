'use strict';

var SelectMenu = require('../menus/select-menu');
var TroopMenu = require('./troop-menu');
var CityInfo = require('./city-info');
var OverlayState = require('./overlay-state');
var tweenUtil = require('../utils/tween-util');
var _ = {
    forEach: require('lodash/collection/forEach')
};

function CityMenu(game) {
    OverlayState.call(this, game);

    this.game = game;
}

CityMenu.prototype = Object.create(OverlayState.prototype);

CityMenu.NAME = 'city-menu';

CityMenu.prototype._getMenuConfig = function() {
    var game = this.game;
    var poi = this._poi;
    var organizeOptions = false;
    var config = {
        title: poi.name,
        options: [
            { key: 'info', text: 'Info' }
        ]
    };

    _.forEach(game.gameState.troops, function(troop) {
        if (troop.poi === poi.key) {
            if (!organizeOptions) {
                config.options.push({ key: 'organize-units', text: 'Organize Units'});
                config.options.push({ key: 'organize-equipments', text: 'Organize Equipments'});
                organizeOptions = true;
            }
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
    var menu = this._getMenuConfig();
    var menuWidth = SelectMenu.getAutoMenuWidth(menu);
    var selectMenu = new SelectMenu(game, poi.x - menuWidth / 2, poi.y - 20, menuWidth, menu);

    tweenUtil.fadeIn(game.stage.addChild(selectMenu));

    selectMenu.onClick('moro', function() {
        game.state.start(TroopMenu.NAME, undefined, undefined, poi, 'moro');
    });

    if (poi.description) {
        selectMenu.onClick('info', function() {
            game.state.start(CityInfo.NAME, undefined, undefined, poi);
        });
    }

    this._selectMenu = selectMenu;
};

CityMenu.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._selectMenu.destroy();
};


module.exports = CityMenu;
