'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');

function MessagePanel(game, x, y, text) {
    Panel.call(this, game, x, y, MessagePanel.WIDTH, MessagePanel.HEIGHT);

    this._renderMessage(text);
    this._renderFlasher();

    this._lastUpdateTime = Date.now();
}

MessagePanel.prototype = Object.create(Panel.prototype);

MessagePanel.WIDTH = 268;
MessagePanel.HEIGHT = 70;

MessagePanel.prototype._renderMessage = function(text) {
    this._messageText = textUtil.renderText(this.game, Panel.X_PADDING, 3, text, {
        type: 'value', scale: 1.25, parent: this, style: { wordWrap: true, wordWrapWidth: 262 }
    });
};

MessagePanel.prototype._renderFlasher = function() {
    this._flasher = textUtil.renderText(this.game, MessagePanel.WIDTH / 2, MessagePanel.HEIGHT - 8, 'Y', {
        type: 'value', scale: 1, parent: this, align: 'center'
    });
    this._enableFlasher = true;
};

MessagePanel.prototype.update = function() {
    if (this._enableFlasher && this._lastUpdateTime + 500 < Date.now()) {
        this._flasher.visible = !this._flasher.visible;
        this._lastUpdateTime = Date.now();
    }
};

MessagePanel.prototype.setFlasher = function(enableFlasher) {
    this._enableFlasher = enableFlasher;
    this._flasher.visible = enableFlasher;
};

MessagePanel.prototype.setMessage = function(text) {
    this._messageText.setText(text);
};

module.exports = MessagePanel;
