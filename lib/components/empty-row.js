'use strict';

var graphicUtil = require('../utils/graphic-util');
var UnitSlot = require('./unit-slot');

function EmptyRow(game, x, y) {
    Phaser.Graphics.call(this, game, x, y);

    this._render();
}

EmptyRow.prototype = Object.create(Phaser.Graphics.prototype);

EmptyRow.prototype._render = function() {
    var unitSlot = new UnitSlot(this.game, 0, 0);
    var x;

    this.addChild(unitSlot);

    for (x = UnitSlot.WIDTH + 5; x <= UnitSlot.WIDTH + 195; x+=2) {
        this.lineStyle(1, 0x000000, 1);
        graphicUtil.drawHorizontalLine(this, x-1, x+1, 8);
        graphicUtil.drawVerticalLine(this, x, 6, 9);
        this.lineStyle(1, 0xFFFFFF, 1);
        graphicUtil.drawHorizontalLine(this, x, x+1, 8);
    }
};

module.exports = EmptyRow;
