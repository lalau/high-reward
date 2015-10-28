'use strict';

var textUtil = require('../utils/text-util');
var _ = {
    padLeft: require('lodash/string/padLeft')
};

function HpStatus(game, x, y, unit, side) {
    Phaser.Graphics.call(this, game, x, y);

    this._unit = unit;
    this._side = side;

    this._render();
}

HpStatus.prototype = Object.create(Phaser.Graphics.prototype);

HpStatus.WIDTH = 60;
HpStatus.TEXT_X = HpStatus.WIDTH / 2;

HpStatus.prototype.update = function() {
    var hpTextValue = this._getHpTextValue();

    if (this._hpText.text !== hpTextValue) {
        this._hpText.setText(hpTextValue);
        this._renderHpBar();
    }
};

HpStatus.prototype._getHpTextValue = function() {
    var unitAttrs = this._unit.attrs;
    return _.padLeft(unitAttrs.hp, 3, 0) + '/' + _.padLeft(unitAttrs.maxHp, 3, 0);
};

HpStatus.prototype._render = function() {
    this.beginFill(0x000000);
    this.drawRect(0, 0, HpStatus.WIDTH, 2);
    this.beginFill(0x0040AA);
    this.drawRect(0, 3, HpStatus.WIDTH, 6);
    this.endFill(0x0040AA);

    this._renderHpText();
    this._renderHpBar();
};

HpStatus.prototype._renderHpText = function() {
    var text = this._getHpTextValue();

    this._hpText = textUtil.renderText(this.game, HpStatus.TEXT_X, 2, text, { type: 'value', parent: this, align: 'center' });
};

HpStatus.prototype._renderHpBar = function() {
    var unitAttrs = this._unit.attrs;
    var maxHpWidth = unitAttrs.maxHp / 5;
    var hpWidth = unitAttrs.hp / 5;
    var maxHpX = this._side === 'left' ? 0 : HpStatus.WIDTH - maxHpWidth;
    var hpX = this._side === 'left' ? hpWidth : HpStatus.WIDTH - maxHpWidth;
    var hpBar = new Phaser.Graphics(this.game, 0, 0);

    if (this._hpBar) {
        this._hpBar.destroy();
    }

    hpBar.beginFill(0x86A900);
    hpBar.drawRect(maxHpX, 0, maxHpWidth, 2);

    if (unitAttrs.hp < unitAttrs.maxHp) {
        hpBar.beginFill(0xFF8665);
        hpBar.drawRect(hpX, 0, maxHpWidth - hpWidth, 1);
        hpBar.beginFill(0xFF3021);
        hpBar.drawRect(hpX, 1, maxHpWidth - hpWidth, 1);
    }

    hpBar.endFill();
    this.addChild(hpBar);

    this._hpBar = hpBar;
};

module.exports = HpStatus;
