'use strict';

var Panel = require('./panel');
var EmptyRow = require('../empty-row');
var MemberRow = require('../member-row');

function PersonnelPanel(game, x, y) {
    this._rows = [];

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
        var rowType = member ? 'member' : 'empty';
        var rowConfig = self._rows[count];

        if (rowConfig && rowConfig.type !== rowType) {
            rowConfig.row.destroy();
        }

        if (member) {
            if (!rowConfig || rowConfig.type !== 'member') {
                self._rows[count] = {
                    type: 'member',
                    row: self._renderMemberRow(x, y, member, count)
                };
            } else {
                rowConfig.row.render(member, count);
            }
        } else {
            if (!rowConfig || rowConfig.type !== 'empty') {
                self._rows[count] = {
                    type: 'empty',
                    row: self._renderEmptyRow(x, y)
                };
            }
        }
    });
};

PersonnelPanel.prototype._renderMemberRow = function(x, y, member, index) {
    var memberRow = new MemberRow(this.game, x, y);

    memberRow.render(member, index);
    this.addChild(memberRow);

    return memberRow;
};

PersonnelPanel.prototype._renderEmptyRow = function(x, y) {
    var emptyRow = new EmptyRow(this.game, x, y);

    emptyRow.render();
    this.addChild(emptyRow);

    return emptyRow;
};

module.exports = PersonnelPanel;
