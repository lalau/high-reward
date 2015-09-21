'use strict';

var graphicUtil = require('./graphic-util');

function EmptySlot(game, x, y) {
    Phaser.Graphics.call(this, game, x, y);
}

EmptySlot.prototype = Object.create(Phaser.Graphics.prototype);

EmptySlot.SLOT_WIDTH = 32;

EmptySlot.prototype.render = function() {
    this._renderBackground();
    this._renderBorder();
    this._renderEmptyDetail();
};

EmptySlot.prototype._renderBackground = function() {
    this.lineStyle(1, 0xAA5500, 1);

    for (var y = 3; y <= EmptySlot.SLOT_WIDTH - 4; y++) {
        for (var x = 3 + (y + 1) % 2; x <= EmptySlot.SLOT_WIDTH - 4; x+=2) {
            this.moveTo(x, y);
            this.lineTo(x + 1, y);
        }
    }
};

EmptySlot.prototype._renderBorder = function() {
    this.lineStyle(1, 0x0040AA, 1);

    this.drawRect(1, 1, 2, 2);
    this.drawRect(EmptySlot.SLOT_WIDTH - 4, 1, 2, 2);
    this.drawRect(EmptySlot.SLOT_WIDTH - 4, EmptySlot.SLOT_WIDTH - 4, 2, 2);
    this.drawRect(1, EmptySlot.SLOT_WIDTH - 4, 2, 2);

    this.lineStyle(1, 0x00AACB, 1);

    graphicUtil.drawHorizontalLine(this, 2, 3, 2);
    graphicUtil.drawHorizontalLine(this, EmptySlot.SLOT_WIDTH - 3, EmptySlot.SLOT_WIDTH - 2, 2);
    graphicUtil.drawHorizontalLine(this, 2, 3, EmptySlot.SLOT_WIDTH - 3);
    graphicUtil.drawHorizontalLine(this, EmptySlot.SLOT_WIDTH - 3, EmptySlot.SLOT_WIDTH - 2, EmptySlot.SLOT_WIDTH - 3);

    this.lineStyle(1, 0x0040AA, 1);

    graphicUtil.drawHorizontalLine(this, 3, EmptySlot.SLOT_WIDTH - 3, 0);
    graphicUtil.drawHorizontalLine(this, 3, EmptySlot.SLOT_WIDTH - 3, 2);
    graphicUtil.drawHorizontalLine(this, 3, EmptySlot.SLOT_WIDTH - 3, EmptySlot.SLOT_WIDTH - 3);
    graphicUtil.drawHorizontalLine(this, 3, EmptySlot.SLOT_WIDTH - 3, EmptySlot.SLOT_WIDTH - 1);
    graphicUtil.drawVerticalLine(this, EmptySlot.SLOT_WIDTH - 3, 2, EmptySlot.SLOT_WIDTH - 4);
    graphicUtil.drawVerticalLine(this, EmptySlot.SLOT_WIDTH - 1, 2, EmptySlot.SLOT_WIDTH - 4);
    graphicUtil.drawVerticalLine(this, 0, 2, EmptySlot.SLOT_WIDTH - 4);
    graphicUtil.drawVerticalLine(this, 2, 2, EmptySlot.SLOT_WIDTH - 4);

    this.lineStyle(1, 0x00AACB, 1);

    graphicUtil.drawHorizontalLine(this, 3, EmptySlot.SLOT_WIDTH - 3, 1);
    graphicUtil.drawHorizontalLine(this, 3, EmptySlot.SLOT_WIDTH - 3, EmptySlot.SLOT_WIDTH - 2);
    graphicUtil.drawVerticalLine(this, EmptySlot.SLOT_WIDTH - 2, 2, EmptySlot.SLOT_WIDTH - 4);
    graphicUtil.drawVerticalLine(this, 1, 2, EmptySlot.SLOT_WIDTH - 4);
};

EmptySlot.prototype._renderEmptyDetail = function() {
    var x;

    for (x = EmptySlot.SLOT_WIDTH + 5; x <= EmptySlot.SLOT_WIDTH + 195; x+=2) {
        this.lineStyle(1, 0x000000, 1);
        graphicUtil.drawHorizontalLine(this, x-1, x+1, 8);
        graphicUtil.drawVerticalLine(this, x, 6, 9);
        this.lineStyle(1, 0xFFFFFF, 1);
        graphicUtil.drawHorizontalLine(this, x, x+1, 8);
    }
};

module.exports = EmptySlot;
