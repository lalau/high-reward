'use strict';

var Panel = require('./panel');
var textUtil = require('../text-util');

function TroopFormationTitlePanel(game, x, y) {
    Panel.call(this, game, x, y, TroopFormationTitlePanel.WIDTH, TroopFormationTitlePanel.HEIGHT);

    this._group = new Phaser.Group(game, this);
    this._unit = null;
}

TroopFormationTitlePanel.prototype = Object.create(Panel.prototype);

TroopFormationTitlePanel.WIDTH = 284;
TroopFormationTitlePanel.HEIGHT = 22;

TroopFormationTitlePanel.prototype.render = function(troop) {
    this._troop = troop;

    var title = troop.getName();
    var x;

    if (this._titleText) {
        if (this._titleText.text !== title) {
            this._titleText.setText(title);
        }
        return;
    }

    x = TroopFormationTitlePanel.WIDTH / 2;
    this._titleText = textUtil.renderText(this.game, x, 7, title, { type: 'value', parent: this, scale: 1.5 });
    this._titleText.anchor.x = 0.5;
};

module.exports = TroopFormationTitlePanel;
