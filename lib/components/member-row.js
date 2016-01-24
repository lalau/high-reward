'use strict';

var UnitSlot = require('./unit-slot');
var textUtil = require('../utils/text-util');
var attributeMixin = require('../mixins/attribute-mixin');
var componentMixin = require('../mixins/component-mixin');
var _ = {
    assign: require('lodash/object/assign'),
    padLeft: require('lodash/string/padLeft')
};

function MemberRow(game, x, y, member, index) {
    Phaser.Graphics.call(this, game, x, y);

    this._member = member;
    this._index = index;

    this._render();
}

MemberRow.prototype = Object.create(Phaser.Graphics.prototype);

_.assign(MemberRow.prototype, attributeMixin);
_.assign(MemberRow.prototype, componentMixin);

MemberRow.prototype.setMember = function(member) {
    this._member = member;
};

MemberRow.prototype._render = function() {
    this._renderUnitSlot();
    this._renderTitle();
    this._renderMembersAttributes();
};

MemberRow.prototype._renderUnitSlot = function() {
    this._unitSlot = new UnitSlot(this.game, 0, 4, this._index, this._member, this._index, {
        enableBackground: false
    });
    this.addChild(this._unitSlot);
};

MemberRow.prototype._renderTitle = function() {
    var title = this._getDisplayTitle();

    this._titleText = textUtil.renderText(this.game, 36, 3, title, { type: 'value', scale: 1.5 });
    this.addChild(this._titleText);
};

MemberRow.prototype._renderMembersAttributes = function() {
    var member = this._member;
    var attrs = member.attrs;

    this._renderAttributes(36, 15, {
        key: 'member',
        pad: 3,
        parent: this,
        attrs: [{
            key: 'hp',
            data: { name: 'HP', value: attrs.hp, max: attrs.maxHp },
            nextSpace: 6
        }, {
            key: 'exp',
            data: { name: 'E', value: member.getExpert() },
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
            nextLine: 1,
            nextSpace: 10
        }, {
            key: 'pay',
            data: { name: 'PAY', value: ':' + _.padLeft(member.getPay(), 6, ' ') },
            pad: 0,
            nextSpace: 1
        }, {
            key: 'gol',
            data: { name: 'GOL', value: '' },
            pad: 0
        }]
    });
};

MemberRow.prototype._getDisplayTitle = function() {
    return this._member.name;
};

MemberRow.prototype.update = function() {
    this._updateUnitSlot();
    this._updateTitle();
    this._renderMembersAttributes();
};

MemberRow.prototype._updateUnitSlot = function() {
    this._unitSlot.setUnit(this._member, this._index);
    this._unitSlot.update();
};

MemberRow.prototype._updateTitle = function() {
    var title = this._getDisplayTitle();

    if (this._titleText.text !== title) {
        this._titleText.setText(title);
    }
};

module.exports = MemberRow;
