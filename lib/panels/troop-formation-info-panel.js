'use strict';

var Panel = require('./panel');
var textUtil = require('../text-util');
var _ = {
    padLeft: require('lodash/string/padLeft')
};

function TroopFormationInfoPanel(game, x, y) {
    Panel.call(this, game, x, y, TroopFormationInfoPanel.WIDTH, TroopFormationInfoPanel.HEIGHT);

    this._group = new Phaser.Group(game, this);
    this._unit = null;
}

TroopFormationInfoPanel.prototype = Object.create(Panel.prototype);

TroopFormationInfoPanel.WIDTH = 284;
TroopFormationInfoPanel.HEIGHT = 94;

TroopFormationInfoPanel.prototype.render = function(unit) {
    if (unit !== undefined) {
        this._unit = unit;
        if (unit === null) {
            this._group.visible = false;
        }
    }

    if (!unit) {
        return;
    }

    this._renderUnit();
    this._renderName();
    this._renderUnitAttributes();
    this._renderItems();

    if (this._group.visible !== true) {
        this._group.visible = true;
    }
};

TroopFormationInfoPanel.prototype._renderUnit = function() {
    this._renderUnitImage(Panel.X_PADDING, 7, this._unit, '_unitImage', this._group);
};

TroopFormationInfoPanel.prototype._renderName = function() {
    var unit = this._unit;
    var name = unit.type;

    if (name === 'commander') {
        name = unit.fullName;
    }

    if (this._nameText) {
        this._nameText.setText(name);
        return;
    }

    this._nameText = textUtil.renderText(this.game, 42, 7, name, {scale: 1.5, type: 'value', parent: this._group});
};

TroopFormationInfoPanel.prototype._renderUnitAttributes = function() {
    var attrs = this._unit.attrs;

    this._renderAttributes(42, 23, {
        key: 'unit',
        separator: ':',
        pad: 3,
        parent: this._group,
        attrs: [{
            key: 'hp',
            data: { name: 'HP', value: attrs.hp, max: attrs.maxHp },
            nextSpace: 8
        }, {
            key: 'exp',
            data: { name: 'E', value: attrs.expert },
            nextSpace: 1
        }, {
            key: 'fat',
            data: { name: 'F', value: attrs.fatigue },
            nextLine: 1
        }, {
            key: 'sht',
            data: { name: 'S', value: attrs.shoot },
            nextSpace: 1
        }, {
            key: 'def',
            data: { name: 'D', value: attrs.defence },
            nextSpace: 1
        }, {
            key: 'trd',
            data: { name: 'T', value: attrs.trading },
            nextSpace: 1
        }, {
            key: 'perf',
            data: { name: 'P', value: attrs.performance },
            nextSpace: 1
        }, {
            key: 'bld',
            data: { name: 'B', value: attrs.building },
            nextSpace: 1
        }]
    });
};

TroopFormationInfoPanel.prototype._renderItems = function() {
    textUtil.renderText(this.game, Panel.X_PADDING, 44, 'W:----------- A:--- S:---', { type: 'value', scale: 1.5, parent: this._group });
    textUtil.renderText(this.game, Panel.X_PADDING, 60, 'P:----------- D:---', { type: 'value', scale: 1.5, parent: this._group });
    textUtil.renderText(this.game, Panel.X_PADDING, 76, 'I:-----------', { type: 'value', scale: 1.5, parent: this._group });
};

TroopFormationInfoPanel.prototype._renderAttributes = function(x, y, options) {
    var leftX = x;
    var attrs = options.attrs;
    var attrConfig = { groupKey: options.key, separator: options.separator, pad: options.pad, parent: this._group };

    attrs.forEach(function(attr) {
        var attrText = this._renderAttribute(x, y, attr, attrConfig);
        var nextSpace = attr.nextSpace || 0;

        if (attr.nextLine) {
            x = leftX;
            y += attr.nextLine * 8;
        } else {
            x += (attr.data.name.length + attrText.text.length + nextSpace) * 7;
        }
    }, this);
};

TroopFormationInfoPanel.prototype._renderAttribute = function(x, y, attr, options) {
    var groupKey = options.groupKey;
    var attrKey = attr.key;
    var attrData = attr.data;
    var attrTexts = this._attrGroups && this._attrGroups[groupKey] || {};
    var pad = options.pad;
    var textParent = options.parent;
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

    if (attrTexts[attrKey]) {
        if (attrTexts[attrKey].text !== value) {
            attrTexts[attrKey].setText(value);
        }
    } else {
        textUtil.renderText(this.game, x, y, attrData.name, { parent: textParent });
        x += attrData.name.length * 7;
        attrTexts[attrKey] = textUtil.renderText(this.game, x, y, value, { parent: textParent, type: 'value' });
        this._attrGroups = this._attrGroups || {};
        this._attrGroups[groupKey] = attrTexts;
    }

    return attrTexts[attrKey];
};

module.exports = TroopFormationInfoPanel;
