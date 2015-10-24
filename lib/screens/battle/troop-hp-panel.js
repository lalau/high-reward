'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');
var formations = require('../../../configs/formations');
var HpStatus = require('../../components/hp-status');

function TroopHpPanel(game, x, y, troop, side) {
    Panel.call(this, game, x, y, TroopHpPanel.WIDTH, TroopHpPanel.HEIGHT);

    this._troop = troop;
    this._side = side;
    this._group = new Phaser.Group(game, this);

    this._render();
}

TroopHpPanel.prototype = Object.create(Panel.prototype);

TroopHpPanel.WIDTH = 268;
TroopHpPanel.HEIGHT = 70;
TroopHpPanel.FORMATION_X = 12;
TroopHpPanel.FORMATION_Y = 7;
TroopHpPanel.FORMATION_CELL_WIDTH = 16;
TroopHpPanel.FORMATION_CELL_HEIGHT = 6;

TroopHpPanel.prototype._render = function() {
    var troop = this._troop;
    var slots = formations[troop.formationIndex].slots;

    troop.formation.forEach(function(memberIndex, slotIndex) {
        if (typeof memberIndex !== 'number' && memberIndex !== 'L') {
            return;
        }

        var unit = troop.getUnitAt(memberIndex);
        var position = this._getHpStatusPosition(slots[slotIndex]);

        this.addChild(new HpStatus(this.game, position.x, position.y, unit, this._side));
    }, this);

    textUtil.renderText(this.game, TroopHpPanel.WIDTH / 2, -13, troop.getName(), { scale: 1.5, type: 'value', parent: this, align: 'center' });
};

TroopHpPanel.prototype._getHpStatusPosition = function(slot) {
    var position = {
        x: TroopHpPanel.FORMATION_X + slot.gx * TroopHpPanel.FORMATION_CELL_WIDTH,
        y: TroopHpPanel.FORMATION_Y + slot.gy * TroopHpPanel.FORMATION_CELL_HEIGHT
    }

    if (this._side === 'left') {
        position.x = TroopHpPanel.WIDTH - position.x - HpStatus.WIDTH;
    }

    return position;
};

module.exports = TroopHpPanel;
