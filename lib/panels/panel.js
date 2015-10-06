'use strict';

var textUtil = require('../text-util');
var attributeMixin = require('../attribute-mixin');
var componentMixin = require('../component-mixin');
var _ = {
    assign: require('lodash/object/assign')
};

function Panel(game, x, y, width, height) {
    Phaser.Graphics.call(this, game, x, y);

    this._config = {
        // game: game,
        // x: x,
        // y: y,
        width: width,
        height: height
    };
    // this._panelGraphic = new Phaser.Graphics(game, x, y);
    this._renderBackground();
}

Panel.prototype = Object.create(Phaser.Graphics.prototype);

_.assign(Panel.prototype, attributeMixin);
_.assign(Panel.prototype, componentMixin);

Panel.X_PADDING = 6;

Panel.prototype.render = function() {};

// Panel.prototype.getDisplayObject = function() {
//     return this._panelGraphic;
// };

Panel.prototype._renderBackground = function() {
    // var panelGraphic = this._panelGraphic;
    var config = this._config;
    var width = config.width;
    var height = config.height;
    var x;

    this.beginFill(0x414100);
    this.drawRect(0, 0, width, height);
    this.endFill();

    this.lineStyle(1, 0xAA5500, 1);
    this.drawRect(1, 1, width - 3, height - 3);
    this.drawRect(2, 2, width - 5, height - 4);

    this.lineStyle(1, 0xFFAA75, 1);
    this.moveTo(width - 2, 0);
    this.lineTo(width - 2, height - 2);

    for (x=2; x<=width-1; x+=2) {
        this.moveTo(x, 1);
        this.lineTo(x + 1, 1);
    }
};

Panel.prototype.renderText = function(x, y, text, config) {
    config = config || {};
    config.parent = config.parent || this;

    return textUtil.renderText(this.game, x, y, text, config);
};

// Panel.prototype.addChild = function() {
//     this._panelGraphic.addChild.apply(this._panelGraphic, arguments);
// };

module.exports = Panel;
