'use strict';

var graphicUtil = require('../utils/graphic-util');

function Button(game, x, y, width, height) {
    Phaser.Graphics.call(this, game, x, y);

    this._config = {
        width: width,
        height: height
    };

    this._render();
    this._initInput();
}

Button.prototype = Object.create(Phaser.Graphics.prototype);

Button.prototype._render = function() {
    this._renderBorder();
};

Button.prototype.enableInput = function() {
    this.inputEnabled = true;
    this.input.priorityID = 200;
};

Button.prototype.disableInput = function() {
    this.inputEnabled = false;
};

Button.prototype._renderBorder = function() {
    var config = this._config;

    this.lineStyle(1, 0xFF8665, 1);
    this.drawRect(0, 0, config.width - 1, config.height - 1);
    this.drawRect(1, 1, config.width - 3, config.height - 3);
    this.lineStyle(1, 0xAA5500, 1);
    this.drawRect(0, 1, config.width - 2, config.height - 2);
    this.lineStyle(1, 0xDBEF65, 1);
    graphicUtil.drawHorizontalLine(this, config.width - 1, config.width, 0);
};

Button.prototype._initInput = function() {
    var config = this._config;

    this.inputEnabled = true;
    this.input.priorityID = 200;
    this.hitArea = new Phaser.Polygon([
        { x: 0, y: 0 },
        { x: 0, y: config.height },
        { x: config.width, y: config.height },
        { x: config.width, y: 0 }
    ]);

    this.events.onInputOver.add(this._renderHoverState, this);
    this.events.onInputOut.add(this._removeHoverState, this);
    this.events.onInputDown.add(this._removeHoverState, this);
};

Button.prototype._renderHoverState = function() {
    if (this._hoverState) {
        this._hoverState.visible = true;
    } else {
        this._hoverState = graphicUtil.getHoverBorder(this.game, 0, 0, this._config.width, this._config.height);
        this.addChild(this._hoverState);
    }
};

Button.prototype._removeHoverState = function() {
    var hoverState = this._hoverState;

    if (!hoverState) {
        return;
    }

    hoverState.visible = false;
};

module.exports = Button;
