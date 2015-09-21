'use strict';

var textUtil = require('./text-util');
var attributeMixin = require('./attribute-mixin');
var _ = {
    assign: require('lodash/object/assign')
};

function MemberSlot(game, x, y) {
    Phaser.Graphics.call(this, game, x, y);
}

MemberSlot.prototype = Object.create(Phaser.Graphics.prototype);

_.assign(MemberSlot.prototype, attributeMixin);

MemberSlot.prototype.render = function(member, index) {
    this._member = member;
    this._index = index;

    this._renderIcon();
    this._renderTitle();
    this._renderAttributes();
};

MemberSlot.prototype._renderIcon = function() {
    var game = this.game;
    var iconKey = this._member.getAssetKey() + '-stand';
    var iconIndex;

    if (this._icon && this._icon.key === iconKey) {
        return;
    }

    if (this._icon) {
        iconIndex = this.getChildIndex(this._icon);
        this._icon.destroy();
    } else {
        textUtil.renderText(game, 0, 6, this._index + 1, { type: 'value', parent: this });
    }

    this._icon = new Phaser.Image(game, 0, 4, iconKey);
    this.addChild(this._icon);

    if (iconIndex !== this.getChildIndex(this._icon)) {
        this.setChildIndex(this._icon, iconIndex);
    }
};

MemberSlot.prototype._renderTitle = function() {
    var game = this.game;
    var title = this._member.type;

    if (this._titleText) {
        if (this._titleText.text === title) {
            return;
        }
        this._titleText.setText(title);
        return;
    }

    this._titleText = textUtil.renderText(game, 36, 4, title, { type: 'value', scale: 1.5 });
    this.addChild(this._titleText);
};

MemberSlot.prototype._renderAttributes = function() {
    var game = this.game;
    var member = this._member;
    var attrs = member.attrs;
    var keyPrefix = 'member' + this._index;
    var payTextKey = keyPrefix + 'payText';
    var pay = member.getPay();

    this.renderCompactAttributeGroup(keyPrefix + 'hp', 36, 17, [
        { key: 'HP', value: attrs.hp, max: attrs.maxHp }
    ]);

    this.renderCompactAttributeGroup(keyPrefix + 'ef', 141, 17, [
        { key: 'E', value: attrs.expert },
        { key: 'F', value: attrs.fatigue }
    ]);

    this.renderCompactAttributeGroup(keyPrefix + 'attr', 36, 25, [
        { key: 'S', value: attrs.shoot },
        { key: 'D', value: attrs.defence },
        { key: 'T', value: attrs.trading },
        { key: 'P', value: attrs.performance },
        { key: 'B', value: attrs.building }
    ]);

    if (this[payTextKey]) {
        if (this[payTextKey].text !== pay) {
            this[payTextKey].setText(pay);
        }
    } else {
        textUtil.renderText(game, 106, 33, 'PAY', { parent: this });
        textUtil.renderText(game, 127, 33, ':', { type: 'value', parent: this });
        textUtil.renderText(game, 205, 33, 'GOL', { align: 'right', parent: this });
        this[payTextKey] = textUtil.renderText(game, 184, 33, member.getPay(), { type: 'value', align: 'right', parent: this });
    }
};

module.exports = MemberSlot;
