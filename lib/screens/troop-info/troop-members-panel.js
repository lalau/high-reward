'use strict';

var Panel = require('../../components/panel');
var EmptyRow = require('../../components/empty-row');
var MemberRow = require('../../components/member-row');

function TroopMembersPanel(game, x, y, troop) {
    Panel.call(this, game, x, y, TroopMembersPanel.WIDTH, TroopMembersPanel.HEIGHT);

    this._troop = troop;
    this._rows = [];

    this._render();
}

TroopMembersPanel.prototype = Object.create(Panel.prototype);

TroopMembersPanel.WIDTH = 476;
TroopMembersPanel.HEIGHT = 206;

TroopMembersPanel.prototype.setTroop = function(troop) {
    this._troop = troop;
};

TroopMembersPanel.prototype.update = function() {
    this._render();
};

TroopMembersPanel.prototype._render = function() {
    var members = this._troop.members;

    members.forEach(function(member, count) {
        var x = count < 5 ? Panel.X_PADDING : 238;
        var y = 7 + 38 * (count % 5);
        var rowType = member ? 'member' : 'empty';
        var rowConfig = this._rows[count];

        if (rowConfig && rowConfig.type !== rowType) {
            rowConfig.row.destroy();
        }

        if (member) {
            if (!rowConfig || rowConfig.type !== 'member') {
                this._rows[count] = {
                    type: 'member',
                    row: this._renderMemberRow(x, y, member, count)
                };
            } else {
                rowConfig.row.setMember(member);
                rowConfig.row.update();
            }
        } else {
            if (!rowConfig || rowConfig.type !== 'empty') {
                this._rows[count] = {
                    type: 'empty',
                    row: this._renderEmptyRow(x, y)
                };
            }
        }
    }, this);
};

TroopMembersPanel.prototype._renderMemberRow = function(x, y, member, index) {
    var memberRow = new MemberRow(this.game, x, y, member, index);

    this.addChild(memberRow);

    return memberRow;
};

TroopMembersPanel.prototype._renderEmptyRow = function(x, y) {
    var emptyRow = new EmptyRow(this.game, x, y);

    this.addChild(emptyRow);

    return emptyRow;
};

module.exports = TroopMembersPanel;
