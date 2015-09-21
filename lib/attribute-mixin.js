'use strict';

var AttributeGroupMixin = {};
var textUtil = require('./text-util');
var _ = {
    padLeft: require('lodash/string/padLeft')
};

AttributeGroupMixin.TEXT_WIDTH = 7;

AttributeGroupMixin.renderAttributeGroup = function(key, x1, x2, y, attrs) {
    var self = this;
    var texts = this._attributeGroups && this._attributeGroups[key] || {};

    attrs.forEach(function(attr) {
        var attrKey = attr.key;
        var value = ':' + _.padLeft(attr.value, 3, 0);

        if (attr.max !== undefined) {
            value += '/' + _.padLeft(attr.max, 3, 0);
        }

        if (texts[attrKey]) {
            if (texts[attrKey].text !== value) {
                texts[attrKey].setText(value);
            }
        } else {
            self.renderText(x1, y, attrKey);
            texts[attrKey] = self.renderText(x2, y, value, { type: 'value', align: 'right' });
        }

        y += 8;
    });

    this._attributeGroups = this._attributeGroups || {};
    this._attributeGroups[key] = texts;
};

AttributeGroupMixin.renderInlineAttributeGroup = function(key, x, y, attrs) {
    var self = this;
    var texts = this._attributeGroups && this._attributeGroups[key] || {};

    attrs.forEach(function(attr) {
        var attrKey = attr.key;
        var value = attr.value;
        var text;

        if (!texts[attrKey]) {
            texts[attrKey] = {};
        }

        text = texts[attrKey];

        if (!text.key) {
            text.key = self.renderText(x, y, attrKey);
        } else if (text.key.x !== x) {
            text.key.x = x;
        }
        x += (attrKey.length + 1) * AttributeGroupMixin.TEXT_WIDTH;

        if (!text.value) {
            text.value = self.renderText(x, y, value, { type: 'value' });
        } else {
            if (text.value.x !== x) {
                text.value.x = x;
            }
            if (text.value.text !== value) {
                text.value.setText(value);
            }
        }
        x += (value.length + 1) * AttributeGroupMixin.TEXT_WIDTH;
    });

    this._attributeGroups = this._attributeGroups || {};
    this._attributeGroups[key] = texts;
};

AttributeGroupMixin.renderCompactAttributeGroup = function(key, x, y, attrs) {
    var self = this;
    var game = this.game || this._config.game;
    var texts = this._attributeGroups && this._attributeGroups[key] || {};

    attrs.forEach(function(attr) {
        var attrKey = attr.key;
        var value = _.padLeft(attr.value, 3, 0);

        if (attr.max !== undefined) {
            value += '/' + _.padLeft(attr.max, 3, 0);
        }

        if (texts[attrKey]) {
            if (texts[attrKey].text !== value) {
                texts[attrKey].setText(value);
            }
        } else {
            textUtil.renderText(game, x, y, attrKey, { parent: self });
            x += AttributeGroupMixin.TEXT_WIDTH * attrKey.length;

            texts[attrKey] = textUtil.renderText(game, x, y, value, { type: 'value', parent: self });
            x += AttributeGroupMixin.TEXT_WIDTH * (value.length + 1);
        }
    });

    this._attributeGroups = this._attributeGroups || {};
    this._attributeGroups[key] = texts;
};

module.exports = AttributeGroupMixin;
