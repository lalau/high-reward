'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');

function TextPanel(game, x, y, width, height, text, enableFlasher) {
    if (width === 'auto') {
        width = text.length * 9 + 60;
    }

    Panel.call(this, game, x, y, width, height);

    textUtil.renderText(this.game, width / 2, 7, text, { type: 'value', scale: 1.25, parent: this, align: 'center' });

    if (enableFlasher) {
        this._renderFlasher();
    }
}

TextPanel.prototype = Object.create(Panel.prototype);

TextPanel.prototype._renderFlasher = function() {
    var config = this._config;

    this._flasher = textUtil.renderText(this.game, config.width / 2, config.height - 8, 'Y', {
        type: 'value', scale: 1, parent: this, align: 'center'
    });
};

TextPanel.prototype.update = function() {
    if (this._flasher && (!this._lastUpdateTime || this._lastUpdateTime + 500 < Date.now())) {
        this._flasher.visible = !this._flasher.visible;
        this._lastUpdateTime = Date.now();
    }
};

module.exports = TextPanel;
