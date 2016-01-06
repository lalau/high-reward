'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');

function TroopFormationInfoPanel(game, x, y) {
    Panel.call(this, game, x, y, TroopFormationInfoPanel.WIDTH, TroopFormationInfoPanel.HEIGHT);

    this._group = new Phaser.Group(game, this);
}

TroopFormationInfoPanel.prototype = Object.create(Panel.prototype);

TroopFormationInfoPanel.WIDTH = 284;
TroopFormationInfoPanel.HEIGHT = 94;
TroopFormationInfoPanel.EMPTY_NAME = '---------------';
TroopFormationInfoPanel.EMPTY_VALUE = '---';

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
    this._nameText = textUtil.renderText(this.game, 42, 6, this._unit.name, {scale: 1.5, type: 'value', parent: this._group}, 'name');
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
    var unit = this._unit;
    var weapon = unit.weapon;
    var protection = unit.protection;
    var items = unit.items;
    var textConfig = { type: 'value', scale: 1.25, parent: this._group };

    textUtil.renderText(this.game, Panel.X_PADDING, 43, 'W:' + (weapon ? weapon.name : TroopFormationInfoPanel.EMPTY_NAME), textConfig, 'wp-name');
    textUtil.renderText(this.game, 175, 43, 'S:' + (weapon ? weapon.shoot : TroopFormationInfoPanel.EMPTY_VALUE), textConfig, 'wp-sht');
    textUtil.renderText(this.game, 230, 43, 'A:' + (weapon ? weapon.attack : TroopFormationInfoPanel.EMPTY_VALUE), textConfig, 'wp-atk');

    textUtil.renderText(this.game, Panel.X_PADDING, 59, 'P:' + (protection ? protection.name : TroopFormationInfoPanel.EMPTY_NAME), textConfig, 'pt-name');
    textUtil.renderText(this.game, 230, 59, 'D:' + (protection ? protection.protect : TroopFormationInfoPanel.EMPTY_VALUE), textConfig, 'pt-pt');

    textUtil.renderText(this.game, Panel.X_PADDING, 75, 'I:' + (items.length > 0 ? (items[0].name + '  x' + items.length) :  TroopFormationInfoPanel.EMPTY_NAME), textConfig, 'it');
};

module.exports = TroopFormationInfoPanel;
