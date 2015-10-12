'use strict';

var Panel = require('./panel');
var textUtil = require('../text-util');

function TroopInfoPanel(game, x, y, troop) {
    Panel.call(this, game, x, y, TroopInfoPanel.WIDTH, TroopInfoPanel.HEIGHT);

    this._troop = troop;

    this._render();
}

TroopInfoPanel.prototype = Object.create(Panel.prototype);

TroopInfoPanel.WIDTH = 476;
TroopInfoPanel.HEIGHT = 94;

TroopInfoPanel.prototype.setTroop = function(troop) {
    this._troop = troop;
};

TroopInfoPanel.prototype._render = function() {
    this._renderName();
    this._renderStatus();
    this._renderWeapons();
};

TroopInfoPanel.prototype._renderName = function() {
    var game = this.game;
    var name = this._getDisplayName();

    textUtil.renderText(game, Panel.X_PADDING, 5, 'TROOP NAME', { parent: this });
    this._nameText = textUtil.renderText(game, Panel.X_PADDING, 14, name, { type: 'value', scale: 2, parent: this });
};

TroopInfoPanel.prototype._renderStatus = function() {
    var troop = this._troop;

    this._renderAttributes(Panel.X_PADDING, 33, {
        key: 'troop',
        separator: ' ',
        parent: this,
        attrs: [{
            key: 'ord',
            data: { name: 'ORDER', value: troop.order.toUpperCase() },
            nextSpace: 1
        },{
            key: 'mov',
            data: { name: 'MOVE', value: troop.move.toUpperCase() },
            nextSpace: 1
        },{
            key: 'tct',
            data: { name: 'TACTIC', value: troop.tactic.toUpperCase() },
            nextSpace: 1
        },{
            key: 'pay',
            data: { name: 'PAY', value: troop.getPay() },
            nextSpace: 1
        }]
    });
};

TroopInfoPanel.prototype._renderWeapons = function() {
    var game = this.game;

    textUtil.renderText(game, Panel.X_PADDING, 45, 'WEAPON', { parent: this });
    textUtil.renderText(game, Panel.X_PADDING, 54, 'CANNON: ------------ A:---', { type: 'value', scale: 1.5, parent: this });
    textUtil.renderText(game, Panel.X_PADDING, 54 + 12, 'VEHICLE: ----------- A:--- D:--- HP:---/---', { type: 'value', scale: 1.5, parent: this });
    textUtil.renderText(game, Panel.X_PADDING, 54 + 24, 'AIRPLANE: ---------- A:--- D:--- HP:---/---', { type: 'value', scale: 1.5, parent: this });
};

TroopInfoPanel.prototype._getDisplayName = function() {
    return this._troop.getName().toUpperCase();
};

TroopInfoPanel.prototype.update = function() {
    this._updateName();
    this._renderStatus();
};

TroopInfoPanel.prototype._updateName = function() {
    var name = this._getDisplayName();

    if (this._nameText.text !== name) {
        this._nameText.setText(name);
    }
};

module.exports = TroopInfoPanel;
