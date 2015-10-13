'use strict';

var AttributeGroupMixin = {};
var textUtil = require('../utils/text-util');
var _ = {
    clone: require('lodash/lang/clone'),
    merge: require('lodash/object/merge'),
    padLeft: require('lodash/string/padLeft')
};

AttributeGroupMixin.TEXT_WIDTH = 7;
AttributeGroupMixin.LINE_HEIGHT = 8;

AttributeGroupMixin._getAttrConfig = function(groupConfig, attr) {
    var attrConfig;

    if (attr.separator !== undefined || attr.pad !== undefined) {
        attrConfig = _.clone(groupConfig);
        if (attr.separator !== undefined) {
            attrConfig.separator = attr.separator;
        }
        if (attr.pad !== undefined) {
            attrConfig.pad = attr.pad;
        }
        return attrConfig;
    } else {
        return groupConfig;
    }
};

AttributeGroupMixin._renderAttributes = function(x, y, options) {
    var leftX = x;
    var attrs = options.attrs;
    var groupConfig = {
        groupKey: options.key,
        separator: options.separator,
        pad: options.pad,
        parent: options.parent,
        fixedLength: options.fixedLength
    };

    attrs.forEach(function(attr) {
        var attrText = this._renderAttribute(x, y, attr, this._getAttrConfig(groupConfig, attr));
        var nextSpace = attr.nextSpace || 0;

        if (attr.nextLine) {
            x = leftX + nextSpace * AttributeGroupMixin.TEXT_WIDTH;
            y += attr.nextLine * AttributeGroupMixin.LINE_HEIGHT;
        } else {
            x += (attr.data.name.length + attrText.value.text.length + nextSpace) * AttributeGroupMixin.TEXT_WIDTH;
        }
    }, this);
};

AttributeGroupMixin._renderAttribute = function(x, y, attr, options) {
    var groupKey = options.groupKey;
    var attrKey = attr.key;
    var attrData = attr.data;
    var attrTexts = this._attrGroups && this._attrGroups[groupKey] || {};
    var attrText = attrTexts[attrKey] || {};
    var pad = options.pad;
    var textParent = options.parent;
    var fixedLength = options.fixedLength;
    var value = options.separator || '';

    if (pad) {
        value += _.padLeft(attrData.value, pad, 0);
    } else {
        value += attrData.value;
    }

    if (attrData.max) {
        value += '/';
        if (pad) {
            value += _.padLeft(attrData.max, pad, 0);
        } else {
            value += attrData.max;
        }
    }

    if (attrText.key) {
        if (attrText.key.x !== x) {
            attrText.key.x = x;
        }
    } else {
        attrText.key = textUtil.renderText(this.game, x, y, attrData.name, { parent: textParent });
    }

    if (fixedLength) {
        x += (fixedLength - value.length) * AttributeGroupMixin.TEXT_WIDTH;
    } else {
        x += attrData.name.length * AttributeGroupMixin.TEXT_WIDTH;
    }

    if (attrText.value) {
        if (attrText.value.text !== value) {
            attrText.value.setText(value);
        }
        if (attrText.value.x !== x) {
            attrText.value.x = x;
        }
    } else {
        attrText.value = textUtil.renderText(this.game, x, y, value, { parent: textParent, type: 'value' });
        attrTexts[attrKey] = attrText;
        this._attrGroups = this._attrGroups || {};
        this._attrGroups[groupKey] = attrTexts;
    }

    return attrText;
};

module.exports = AttributeGroupMixin;
