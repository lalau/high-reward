'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');

function TextPanel(game, x, y, width, height, text) {
    if (width === 'auto') {
        width = text.length * 9 + 60;
    }

    Panel.call(this, game, x, y, width, height);

    textUtil.renderText(this.game, width / 2, 7, text, { type: 'value', scale: 1.25, parent: this, align: 'center' });
}

TextPanel.prototype = Object.create(Panel.prototype);

module.exports = TextPanel;
