'use strict';

var graphicUtil = require('./graphic-util');
var textUtil = require('./text-util');
var componentMixin = require('./component-mixin');
var _ = {
    assign: require('lodash/object/assign')
};

function UnitSlot(game, x, y, slotIndex) {
    Phaser.Graphics.call(this, game, x, y);

    this._unit = null;
    this._renderIndex = null;
    this._slotIndex = slotIndex;
}

UnitSlot.prototype = Object.create(Phaser.Graphics.prototype);

_.assign(UnitSlot.prototype, componentMixin);

UnitSlot.WIDTH = 32;

UnitSlot.prototype.render = function(unit, memberIndex) {
    if (unit || unit === null) {
        this._unit = unit;
    }

    if (memberIndex === null) {
        this._renderIndex = null;
    } else if (memberIndex !== undefined) {
        this._renderIndex = memberIndex === 'L' ? memberIndex : (memberIndex + 1);
    }

    this._renderBackground();
    this._renderBorder();
    this._renderUnit();
    this._renderText();
};

UnitSlot.prototype.getUnit = function() {
    return this._unit;
};

UnitSlot.prototype.getRenderIndex = function() {
    return this._renderIndex;
};

UnitSlot.prototype.getSlotIndex = function() {
    return this._slotIndex;
};

UnitSlot.prototype._renderText = function() {
    var index = this._renderIndex;

    if (index === null) {
        if (this._indexText) {
            this._indexText.destroy();
            this._indexText = null;
        }
        return;
    }

    if (!this._indexText) {
        this._indexText = textUtil.renderText(this.game, -2, 5, index, {type: 'value', parent: this});
    } else if (this._indexText.text !== index) {
        this._indexText.setText(index);
    }
};

UnitSlot.prototype._renderUnit = function() {
    this._renderUnitImage(0, 0, this._unit, '_unitImage');

    if (this._unitImage && this.getChildIndex(this._unitImage) !== 0) {
        this.setChildIndex(this._unitImage, 0);
    }
};

UnitSlot.prototype._renderBackground = function() {
    this.lineStyle(1, 0xAA5500, 1);

    for (var y = 3; y <= UnitSlot.WIDTH - 4; y++) {
        for (var x = 3 + (y + 1) % 2; x <= UnitSlot.WIDTH - 4; x+=2) {
            this.moveTo(x, y);
            this.lineTo(x + 1, y);
        }
    }
};

UnitSlot.prototype._renderBorder = function() {
    this.lineStyle(1, 0x0040AA, 1);

    this.drawRect(1, 1, 2, 2);
    this.drawRect(UnitSlot.WIDTH - 4, 1, 2, 2);
    this.drawRect(UnitSlot.WIDTH - 4, UnitSlot.WIDTH - 4, 2, 2);
    this.drawRect(1, UnitSlot.WIDTH - 4, 2, 2);

    this.lineStyle(1, 0x00AACB, 1);

    graphicUtil.drawHorizontalLine(this, 2, 3, 2);
    graphicUtil.drawHorizontalLine(this, UnitSlot.WIDTH - 3, UnitSlot.WIDTH - 2, 2);
    graphicUtil.drawHorizontalLine(this, 2, 3, UnitSlot.WIDTH - 3);
    graphicUtil.drawHorizontalLine(this, UnitSlot.WIDTH - 3, UnitSlot.WIDTH - 2, UnitSlot.WIDTH - 3);

    this.lineStyle(1, 0x0040AA, 1);

    graphicUtil.drawHorizontalLine(this, 3, UnitSlot.WIDTH - 3, 0);
    graphicUtil.drawHorizontalLine(this, 3, UnitSlot.WIDTH - 3, 2);
    graphicUtil.drawHorizontalLine(this, 3, UnitSlot.WIDTH - 3, UnitSlot.WIDTH - 3);
    graphicUtil.drawHorizontalLine(this, 3, UnitSlot.WIDTH - 3, UnitSlot.WIDTH - 1);
    graphicUtil.drawVerticalLine(this, UnitSlot.WIDTH - 3, 2, UnitSlot.WIDTH - 4);
    graphicUtil.drawVerticalLine(this, UnitSlot.WIDTH - 1, 2, UnitSlot.WIDTH - 4);
    graphicUtil.drawVerticalLine(this, 0, 2, UnitSlot.WIDTH - 4);
    graphicUtil.drawVerticalLine(this, 2, 2, UnitSlot.WIDTH - 4);

    this.lineStyle(1, 0x00AACB, 1);

    graphicUtil.drawHorizontalLine(this, 3, UnitSlot.WIDTH - 3, 1);
    graphicUtil.drawHorizontalLine(this, 3, UnitSlot.WIDTH - 3, UnitSlot.WIDTH - 2);
    graphicUtil.drawVerticalLine(this, UnitSlot.WIDTH - 2, 2, UnitSlot.WIDTH - 4);
    graphicUtil.drawVerticalLine(this, 1, 2, UnitSlot.WIDTH - 4);
};

module.exports = UnitSlot;
