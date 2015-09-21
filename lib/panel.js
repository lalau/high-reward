'use strict';

var textUtil = require('./text-util');
var attributeMixin = require('./attribute-mixin');
var _ = {
    assign: require('lodash/object/assign')
};

function Panel(game, x, y, width, height) {
    this._config = {
        game: game,
        x: x,
        y: y,
        width: width,
        height: height
    };
    this._panelGraphic = new Phaser.Graphics(game, x, y);
    this._renderBackground();
}

_.assign(Panel.prototype, attributeMixin);

Panel.X_PADDING = 6;

Panel.prototype.render = function() {};

Panel.prototype.getDisplayObject = function() {
    return this._panelGraphic;
};

Panel.prototype._renderBackground = function() {
    var panelGraphic = this._panelGraphic;
    var config = this._config;
    var width = config.width;
    var height = config.height;
    var x;

    panelGraphic.beginFill(0x414100);
    panelGraphic.drawRect(0, 0, width, height);
    panelGraphic.endFill();

    panelGraphic.lineStyle(1, 0xAA5500, 1);
    panelGraphic.drawRect(1, 1, width - 3, height - 3);
    panelGraphic.drawRect(2, 2, width - 5, height - 4);

    panelGraphic.lineStyle(1, 0xFFAA75, 1);
    panelGraphic.moveTo(width - 2, 0);
    panelGraphic.lineTo(width - 2, height - 2);

    for (x=2; x<=width-1; x+=2) {
        panelGraphic.moveTo(x, 1);
        panelGraphic.lineTo(x + 1, 1);
    }
};

Panel.prototype.renderText = function(x, y, text, config) {
    var game = this._config.game;

    config = config || {};
    config.parent = config.parent || this._panelGraphic;

    return textUtil.renderText(game, x, y, text, config);
};

Panel.prototype.addChild = function() {
    this._panelGraphic.addChild.apply(this._panelGraphic, arguments);
};

module.exports = Panel;
