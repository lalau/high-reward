'use strict';

var Panel = require('./panel');
var EmptySlot = require('./empty-slot');
var MemberSlot = require('./member-slot');

function PersonnelPanel(game, x, y) {
    this._slots = [];

    Panel.call(this, game, x, y, PersonnelPanel.WIDTH, PersonnelPanel.HEIGHT);
}

PersonnelPanel.prototype = Object.create(Panel.prototype);

PersonnelPanel.WIDTH = 476;
PersonnelPanel.HEIGHT = 206;

PersonnelPanel.prototype.render = function(members) {
    var self = this;

    members.forEach(function(member, count) {
        var x = count < 5 ? Panel.X_PADDING : 238;
        var y = 7 + 38 * (count % 5);
        var slotType = member ? 'member' : 'empty';
        var slotConfig = self._slots[count];

        if (slotConfig && slotConfig.type !== slotType) {
            slotConfig.slot.destroy();
        }

        if (member) {
            if (!slotConfig || slotConfig.type !== 'member') {
                self._slots[count] = {
                    type: 'member',
                    slot: self._renderMemberSlot(x, y, member, count)
                };
            } else {
                slotConfig.slot.render(member, count);
            }
        } else {
            if (!slotConfig || slotConfig.type !== 'empty') {
                self._slots[count] = {
                    type: 'empty',
                    slot: self._renderEmptySlot(x, y)
                };
            }
        }
    });
    window.slots = self._slots;
};

PersonnelPanel.prototype._renderMemberSlot = function(x, y, member, index) {
    var game = this._config.game;
    var memberSlot = new MemberSlot(game, x, y);

    memberSlot.render(member, index);
    this.addChild(memberSlot);

    return memberSlot;
};

PersonnelPanel.prototype._renderEmptySlot = function(x, y) {
    var game = this._config.game;
    var emptySlot = new EmptySlot(game, x, y);

    emptySlot.render();
    this.addChild(emptySlot);

    return emptySlot;
};

module.exports = PersonnelPanel;
