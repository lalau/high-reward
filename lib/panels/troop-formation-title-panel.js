'use strict';

var Panel = require('./panel');
var textUtil = require('../text-util');

function TroopFormationTitlePanel(game, x, y, troop) {
    Panel.call(this, game, x, y, TroopFormationTitlePanel.WIDTH, TroopFormationTitlePanel.HEIGHT);

    this._troop = troop;
    this._group = new Phaser.Group(game, this);

    this._render();
}

TroopFormationTitlePanel.prototype = Object.create(Panel.prototype);

TroopFormationTitlePanel.WIDTH = 284;
TroopFormationTitlePanel.HEIGHT = 22;

TroopFormationTitlePanel.prototype._render = function() {
    var title = this._troop.getName();
    var x;

    if (this._titleText) {
        if (this._titleText.text !== title) {
            this._titleText.setText(title);
        }
        return;
    }

    x = TroopFormationTitlePanel.WIDTH / 2;
    this._titleText = textUtil.renderText(this.game, x, 6, title, { type: 'value', parent: this, scale: 1.5, align: 'center' });
};

module.exports = TroopFormationTitlePanel;
