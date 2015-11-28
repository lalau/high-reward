'use strict';

var SelectMenu = require('../menus/select-menu');
var StoreMenu = require('./store-menu');
var Conversation = require('./conversation');
var OverlayState = require('./overlay-state');

function StationMenu(game) {
    OverlayState.call(this, game);

    this.game = game;
}

StationMenu.prototype = Object.create(OverlayState.prototype);

StationMenu.NAME = 'station-menu';

StationMenu.WIDTH = 160;

StationMenu.prototype.init = function(troopPoint, commanderKey) {
    this._troopPoint = troopPoint || this._troopPoint;
    this._commanderKey = commanderKey || this._commanderKey;
};

StationMenu.prototype._getMenu = function() {
    var menu = {
        title: 'TROOP',
        options: [
            { key: 'store', text: 'GO TO STORE' },
            { key: 'hospital', text: 'GO TO HOSPITAL' }
        ]
    };

    return menu;
};

StationMenu.prototype.create = function() {
    OverlayState.prototype.create.call(this);

    var game = this.game;
    var commanderKey = this._commanderKey;
    var troopPoint = this._troopPoint;
    var y = troopPoint.y - 20;
    var selectMenu = new SelectMenu(game, troopPoint.x - StationMenu.WIDTH / 2, y, StationMenu.WIDTH, this._getMenu());

    game.stage.addChild(selectMenu);

    selectMenu.onClick('store', function() {
        game.state.start(StoreMenu.NAME, undefined, undefined, commanderKey);
    });

    selectMenu.onClick('hospital', this._handleHospital, this);

    this._selectMenu = selectMenu;
};

StationMenu.prototype._handleHospital = function() {
    var game = this.game;
    var troop = game.gameState.troops[this._commanderKey];
    var treatmentCost = troop.getTreatmentCost();
    var scriptKey = treatmentCost > 0 ? 'treatment' : 'healthy';

    game.state.start(Conversation.NAME, undefined, undefined, {
        scriptGroup: 'hospital',
        scriptKey: scriptKey,
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
