'use strict';

var attributeMixin = require('../mixins/attribute-mixin');
var componentMixin = require('../mixins/component-mixin');
var graphicUtil = require('../utils/graphic-util');
var _ = {
    assign: require('lodash/object/assign')
};

function Panel(game, x, y, width, height) {
    if (x === 'center') {
        x = Math.floor((game.width - width) / 2);
    }

    if (y === 'center') {
        y = Math.floor((game.height - height) / 2);
    }

    Phaser.Graphics.call(this, game, x, y);

    this._config = {
        width: width,
        height: height
    };

    this.inputEnabled = true;
    this.input.priorityID = 100;

    this._renderBackground();
}

Panel.prototype = Object.create(Phaser.Graphics.prototype);

_.assign(Panel.prototype, attributeMixin);
_.assign(Panel.prototype, componentMixin);

Panel.X_PADDING = 6;

Panel.prototype._render = function() {};

Panel.prototype._renderBackground = function() {
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

    this.lineStyle();
};

Panel.prototype._initHoverEffect = function() {
    this.events.onInputOver.add(function() {
        if (this._hoverState) {
            this._hoverState.visible = true;
        } else {
            this._hoverState = graphicUtil.getHoverBorder(this.game, 0, 0, this._config.width, this._config.height);
            this.addChildAt(this._hoverState, 0);
        }
    }, this);

    [this.events.onInputOut, this.events.onInputDown].forEach(function(event) {
        event.add(function() {
            if (this._hoverState) {
                this._hoverState.visible = false;
            }
        }, this);
    }, this);
};

module.exports = Panel;
