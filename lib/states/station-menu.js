'use strict';

var STATES = require('../../configs/states');
var SelectMenu = require('../menus/select-menu');
var OverlayState = require('./overlay-state');
var npc = require('../../configs/npc');
var tweenUtil = require('../utils/tween-util');

function StationMenu(game) {
    OverlayState.call(this, game);

    this.game = game;
}

StationMenu.prototype = Object.create(OverlayState.prototype);

StationMenu.CITY_MENU = {
    title: 'TROOP',
    options: [
        { key: 'build', text: 'Build' },
        { key: 'market', text: 'Market' },
        { key: 'store', text: 'Store' },
        { key: 'tarven', text: 'Tarven' },
        { key: 'hospital', text: 'Hospital' },
        { key: 'public-bulletin', text: 'Public Bulletin' },
        { key: 'military-bulletin', text: 'Military Bulletin' }
    ]
};
StationMenu.UNDERDEVELOPED_CITY_MENU = {
    title: 'TROOP',
    options: [
        { key: 'build', text: 'Build' },
        { key: 'hospital', text: 'Hospital' },
        { key: 'public-bulletin', text: 'Public Bulletin' },
        { key: 'military-bulletin', text: 'Military Bulletin' }
    ]
};
StationMenu.STRONGHOLD_MENU = {
    title: 'TROOP',
    options: [
        { key: 'build', text: 'Build' },
        { key: 'hospital', text: 'Hospital' },
        { key: 'military-bulletin', text: 'Military Bulletin' }
    ]
};

StationMenu.prototype.init = function(troopPoint, commanderKey) {
    this._troopPoint = troopPoint || this._troopPoint;
    this._commanderKey = commanderKey || this._commanderKey;
};

StationMenu.prototype._getMenu = function(poi) {
    if (poi.type === 'stronghold') {
        return StationMenu.STRONGHOLD_MENU;
    } else if (poi.underdeveloped) {
        return StationMenu.UNDERDEVELOPED_CITY_MENU;
    } else {
        return StationMenu.CITY_MENU;
    }
};

StationMenu.prototype.create = function() {
    OverlayState.prototype.create.call(this);

    var game = this.game;
    var commanderKey = this._commanderKey;
    var troopPoint = this._troopPoint;
    var menu = this._getMenu(troopPoint);
    var menuWidth = SelectMenu.getAutoMenuWidth(menu);
    var selectMenu = new SelectMenu(game, troopPoint.x - menuWidth / 2, troopPoint.y - 20, menuWidth, menu);

    tweenUtil.fadeIn(game.stage.addChild(selectMenu));

    selectMenu.onClick('store', function() {
        game.state.start(STATES.StoreMenu, undefined, undefined, commanderKey);
    });

    selectMenu.onClick('hospital', this._handleHospital, this);

    selectMenu.onClick('public-bulletin', function() {
        game.state.start(STATES.Bulletin, undefined, undefined, commanderKey);
    });

    this._selectMenu = selectMenu;
};

StationMenu.prototype._handleHospital = function() {
    var game = this.game;
    var troop = game.gameState.troops[this._commanderKey];
    var treatmentCost = troop.getTreatmentCost();
    var scriptKey = treatmentCost > 0 ? 'treatment' : 'healthy';

    game.state.start(STATES.Conversation, undefined, undefined, {
        scriptGroup: 'hospital',
        scriptKey: scriptKey,
        speakerMap: {
            hospital: npc.hospital
        },
        data: {
            name: this._troopPoint.name,
            amount: treatmentCost
        },
        onSelect: {
            treat: function(doTreat) {
                if (doTreat) {
                    troop.treat();
                    game.gameState.bank -= treatmentCost;
                }
            }
        }
    });
};

StationMenu.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._selectMenu.destroy();
};

module.exports = StationMenu;
