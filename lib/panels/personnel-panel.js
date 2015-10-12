'use strict';

var Panel = require('./panel');
var EmptyRow = require('../empty-row');
var MemberRow = require('../member-row');

function PersonnelPanel(game, x, y, troop) {
    Panel.call(this, game, x, y, PersonnelPanel.WIDTH, PersonnelPanel.HEIGHT);

    this._troop = troop;
    this._rows = [];

    this._render();
}

PersonnelPanel.prototype = Object.create(Panel.prototype);

PersonnelPanel.WIDTH = 476;
PersonnelPanel.HEIGHT = 206;

PersonnelPanel.prototype.setTroop = function(troop) {
    this._troop = troop;
};

PersonnelPanel.prototype.update = function() {
    this._render();
};

PersonnelPanel.prototype._render = function() {
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

PersonnelPanel.prototype._renderMemberRow = function(x, y, member, index) {
    var memberRow = new MemberRow(this.game, x, y, member, index);

    this.addChild(memberRow);

    return memberRow;
};

PersonnelPanel.prototype._renderEmptyRow = function(x, y) {
    var emptyRow = new EmptyRow(this.game, x, y);

    this.addChild(emptyRow);

    return emptyRow;
};

module.exports = PersonnelPanel;
