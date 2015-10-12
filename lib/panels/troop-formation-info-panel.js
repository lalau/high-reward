'use strict';

var Panel = require('./panel');
var textUtil = require('../text-util');

function TroopFormationInfoPanel(game, x, y) {
    Panel.call(this, game, x, y, TroopFormationInfoPanel.WIDTH, TroopFormationInfoPanel.HEIGHT);

    this._group = new Phaser.Group(game, this);
}

TroopFormationInfoPanel.prototype = Object.create(Panel.prototype);

TroopFormationInfoPanel.WIDTH = 284;
TroopFormationInfoPanel.HEIGHT = 94;

TroopFormationInfoPanel.prototype.setUnit = function(unit) {
    this._unit = unit;
    this._render();
};

TroopFormationInfoPanel.prototype._render = function() {
    var group = this._group;

    if (!this._unit) {
        if (group.visible) {
            group.visible = false;
        }
        return;
    } else {
        if (!group.visible) {
            group.visible = true;
        }
    }

    this._renderUnit();
    this._renderName();
    this._renderUnitAttributes();
    this._renderItems();

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

    this._nameText = textUtil.renderText(this.game, 42, 6, name, {scale: 1.5, type: 'value', parent: this._group});
};

TroopFormationInfoPanel.prototype._renderUnitAttributes = function() {
    var attrs = this._unit.attrs;

    this._renderAttributes(42, 21, {
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
    textUtil.renderText(this.game, Panel.X_PADDING, 43, 'W:----------- A:--- S:---', { type: 'value', scale: 1.5, parent: this._group });
    textUtil.renderText(this.game, Panel.X_PADDING, 59, 'P:----------- D:---', { type: 'value', scale: 1.5, parent: this._group });
    textUtil.renderText(this.game, Panel.X_PADDING, 75, 'I:-----------', { type: 'value', scale: 1.5, parent: this._group });
};

module.exports = TroopFormationInfoPanel;
