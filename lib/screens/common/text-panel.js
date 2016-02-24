'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');
var _ = {
    template: require('lodash/string/template')
};

function TextPanel(game, x, y, width, height, text, options) {
    var textY = 7;
    var textOptions;
    var textX;

    options = options || {};

    if (text.indexOf('${') >= 0) {
        text = _.template(text)(options.data);
    }

    if (width === 'auto') {
        width = text.length * 9 + 60;
    }

    Panel.call(this, game, x, y, width, height);

    textOptions = {
        type: 'value',
        scale: 1.25,
        parent: this
    };

    if (options.multiline) {
        textX = Panel.X_PADDING;
        textOptions.style = {
            wordWrap: true,
            wordWrapWidth: width - Panel.X_PADDING - Panel.X_PADDING
        };
    } else {
        textX = width / 2;
        textOptions.align = 'center';
    }

    if (options.title) {
        textUtil.renderText(this.game, Panel.X_PADDING, textY, options.title, { parent: this });
        textY = 18;
    }

    textUtil.renderText(this.game, textX, textY, text, textOptions);

    if (options.enableFlasher) {
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
