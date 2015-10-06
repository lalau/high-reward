'use strict';

var Panel = require('./panel');

function TroopInfoPanel(game, x, y) {
    Panel.call(this, game, x, y, TroopInfoPanel.WIDTH, TroopInfoPanel.HEIGHT);
}

TroopInfoPanel.prototype = Object.create(Panel.prototype);

TroopInfoPanel.WIDTH = 476;
TroopInfoPanel.HEIGHT = 94;

TroopInfoPanel.prototype.render = function(troop) {
    if (troop) {
        this._troop = troop;
    }

    this._renderName();
    this._renderStatus();
    this._renderWeapons();

    this._rendered = true;
};

TroopInfoPanel.prototype._renderName = function() {
    var name = this._troop.getName().toUpperCase();

    if (this._nameText) {
        if (this._nameText.text === name) {
            return;
        }
        this._nameText.setText(name);
        return;
    }

    this.renderText(Panel.X_PADDING, 7, 'TROOP NAME');
    this._nameText = this.renderText(Panel.X_PADDING, 15, name, { type: 'value', scale: 2 });
};

TroopInfoPanel.prototype._renderStatus = function() {
    var troop = this._troop;

    this.renderInlineAttributeGroup('troop', Panel.X_PADDING, 35, [
        { key: 'ORDER' , value: troop.order.toUpperCase() },
        { key: 'MOVE' , value: troop.move.toUpperCase() },
        { key: 'TACTIC' , value: troop.tactic.toUpperCase() },
        { key: 'PAY' , value: troop.getPay() }
    ]);
};

TroopInfoPanel.prototype._renderWeapons = function() {
    if (this._rendered) {
        return;
    }

    this.renderText(Panel.X_PADDING, 47, 'WEAPON');
    this.renderText(Panel.X_PADDING, 55, 'CANNON: ------------ A:---', { type: 'value', scale: 1.5 });
    this.renderText(Panel.X_PADDING, 55 + 12, 'VEHICLE: ----------- A:--- D:--- HP:---/---', { type: 'value', scale: 1.5 });
    this.renderText(Panel.X_PADDING, 55 + 24, 'AIRPLANE: ---------- A:--- D:--- HP:---/---', { type: 'value', scale: 1.5 });
};

module.exports = TroopInfoPanel;
