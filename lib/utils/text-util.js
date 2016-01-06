'use strict';

var sizes = {'1': '8px', '1.25': '10px', '1.5': '12px', '2': '16px'};
var fills = {key: '#FFAA75', value: '#FFFFFF'};
var anchors = {left: 0, right: 1, center: 0.5};
var textUtil = {};
var _ = {
    assign: require('lodash/object/assign')
};

textUtil.renderText = function(game, x, y, value, config, key) {
    if (key && config.parent && config.parent._texts && config.parent._texts[key]) {
        config.parent._texts[key].setText(value);
        return config.parent._texts[key];
    }

    config = config || {};
    config.scale = config.scale || 1;
    config.type = config.type || 'key';
    config.align = config.align || 'left';

    var style = _.assign({
        font: sizes[config.scale] + ' Topaz-8',
        fill: config.fill || fills[config.type]
    }, config.style);
    var text = new Phaser.Text(game, x, y, value, style);

    text.setShadow(1, 1);
    text.anchor.x = anchors[config.align];

    if (config.parent) {
        config.parent.addChild(text);

        if (key) {
            config.parent._texts = config.parent._texts || {};
            config.parent._texts[key] = text;
        }
    }

    return text;
};

module.exports = textUtil;
