'use strict';

var textUtil = {};

textUtil.renderText = function(game, x, y, value, config) {
    config = config || {};
    y = y - ((config.scale === 2 || config.scale === 1.5) ? 1 : 2);

    var size = config.scale === 2 ? '16px' : (config.scale === 1.5 ? '12px' : '8px');
    var fill = config.type === 'value' ? '#FFFFFF' : '#FFAA75';
    var text = new Phaser.Text(game, x, y, value, {
        font: size + ' Topaz-8',
        fill: fill
    });

    text.setShadow(1, 1);

    if (config.align === 'right') {
        text.anchor.x = 1;
    }

    if (config.parent) {
        config.parent.addChild(text);
    }

    return text;
};

module.exports = textUtil;
