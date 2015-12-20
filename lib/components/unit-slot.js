'use strict';

var graphicUtil = require('../utils/graphic-util');
var textUtil = require('../utils/text-util');
var componentMixin = require('../mixins/component-mixin');
var _ = {
    assign: require('lodash/object/assign')
};

function UnitSlot(game, x, y, slotIndex, unit, memberIndex, config) {
    Phaser.Graphics.call(this, game, x, y);

    this._unit = unit || null;
    this._slotIndex = slotIndex;
    this._memberIndex = memberIndex === undefined ? null : memberIndex;
    this._renderIndex = this._setupRenderIndex();
    this._config = config || {};
    this._config.enableBackground = this._config.enableBackground === undefined ? true : this._config.enableBackground;
    this._config.enableRenderIndex = this._config.enableRenderIndex === undefined ? true : this._config.enableRenderIndex;

    this._render();
}

UnitSlot.prototype = Object.create(Phaser.Graphics.prototype);

_.assign(UnitSlot.prototype, componentMixin);

UnitSlot.WIDTH = 32;
UnitSlot.SUBSLOT_WIDTH = 24;
UnitSlot.SUBSLOT_X = UnitSlot.WIDTH / 2;
UnitSlot.SUBSLOT_Y = UnitSlot.WIDTH / 2.5;
UnitSlot.HIT_AREA = {
    unit: new Phaser.Polygon([
        { x: 0, y: 0 },
        { x: 0, y: UnitSlot.WIDTH },
        { x: UnitSlot.WIDTH, y: UnitSlot.WIDTH },
        { x: UnitSlot.WIDTH, y: 0 }
    ]),
    sub: new Phaser.Polygon([
        { x: UnitSlot.SUBSLOT_X, y: UnitSlot.SUBSLOT_Y },
        { x: UnitSlot.SUBSLOT_X, y: UnitSlot.SUBSLOT_Y + UnitSlot.SUBSLOT_WIDTH },
        { x: UnitSlot.SUBSLOT_X + UnitSlot.SUBSLOT_WIDTH, y: UnitSlot.SUBSLOT_Y + UnitSlot.SUBSLOT_WIDTH },
        { x: UnitSlot.SUBSLOT_X + UnitSlot.SUBSLOT_WIDTH, y: UnitSlot.SUBSLOT_Y }
    ])
};

UnitSlot.prototype._render = function() {
    if (this._config.enableBackground) {
        this._renderBackground();
        this._renderBorder();
    }
    this._renderUnit();
    this._renderText();
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

UnitSlot.prototype._renderUnit = function() {
    var image = this._renderUnitImage(0, 0, this._unit, '_unitImage');

    if (image && this.getChildIndex(image) !== 0) {
        this.setChildIndex(image, 0);
    }
};

UnitSlot.prototype._renderText = function() {
    var index = this._renderIndex;

    if (index === null || !this._unit) {
        return;
    }

    this._indexText = textUtil.renderText(this.game, 0, 0, index, {type: 'value', parent: this});
};

UnitSlot.prototype.update = function() {
    this._renderUnit();
    this._updateText();
    if (this._subSlotType) {
        this.enableSubSlot(this._subSlotType);
    }
};

UnitSlot.prototype._updateText = function() {
    var index = this._renderIndex;

    if (index === null || !this._unit) {
        if (this._indexText) {
            this._indexText.visible = false;
        }
        return;
    }

    if (!this._indexText) {
        this._renderText();
    } else if (this._indexText.text !== index) {
        this._indexText.setText(index);
    }

    if (!this._indexText.visible) {
        this._indexText.visible = true;
    }
};

UnitSlot.prototype._setupRenderIndex = function() {
    var memberIndex = this._memberIndex;

    if (memberIndex === null) {
        return null;
    } else if (memberIndex !== undefined) {
        return memberIndex === 0 ? 'L' : memberIndex;
    }
};

UnitSlot.prototype.setUnit = function(unit, memberIndex) {
    this._unit = unit || null;
    this._memberIndex = memberIndex === undefined ? null : memberIndex;
    this._renderIndex = this._setupRenderIndex();
    this.update();
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

UnitSlot.prototype.getMemberIndex = function() {
    return this._memberIndex;
};

UnitSlot.prototype.enableInput = function(target) {
    target = target || 'unit';

    this.inputEnabled = true;
    this.input.priorityID = 200;
    this.hitArea = UnitSlot.HIT_AREA[target];
};

UnitSlot.prototype.disableInput = function() {
    this.inputEnabled = false;
};

UnitSlot.prototype.enableSubSlot = function(type) {
    var unit = this._unit;
    var item;
    var imageKey;

    if (unit) {
        if (type === 'weapon') {
            item = unit.weapon;
            if (item) {
                imageKey = item.type + '-' + item.key;
            }
        } else if (type === 'protection') {
            item = unit.protection;
            if (item) {
                imageKey = item.key;
            }
        }
    }

    if (this._subSlot) {
        this._subSlot.destroy();
    }

    this._subSlot = this.addChild(new Phaser.Image(this.game, UnitSlot.SUBSLOT_X, UnitSlot.SUBSLOT_Y, 'icons', (imageKey || 'empty-item-slot') + '.png'));
    this._subSlotType = type;
};

UnitSlot.prototype.disableSubSlot = function() {
    if (this._subSlot) {
        this._subSlot.destroy();
        this._subSlot = undefined;
        this._subSlotType = undefined;
    }
};

module.exports = UnitSlot;
