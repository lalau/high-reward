'use strict';

var formations = require('../../configs/formations');
var BattleUnit = require('./battle-unit');

function BattleTroop(game, x, y, troop, side) {
    Phaser.Group.call(this, game, null, 'battlefield');

    this.x = x;
    this.y = y;

    this._side = side;
    this._troop = troop;
    this._battleUnits = {};

    this._render();
}

BattleTroop.WIDTH = 256;
BattleTroop.HEIGHT = 168;

BattleTroop.CELL_WIDTH = 16;
BattleTroop.CELL_HEIGHT = 17;

BattleTroop.prototype = Object.create(Phaser.Group.prototype);

BattleTroop.prototype._render = function() {
    var troop = this._troop;
    var formationIndex = troop.formationIndex;

    formations[formationIndex].slots.forEach(function(slot, slotIndex){
        var unitIndex = troop.formation[slotIndex];
        var unit = troop.getUnitAt(unitIndex);
        var side = this._side;
        var battleUnit;
        var x;
        var y;

        if (!unit) {
            return;
        }

        x = slot.gx * BattleTroop.CELL_WIDTH;
        y = slot.gy * BattleTroop.CELL_HEIGHT;

        if (side === 'left') {
            x = BattleTroop.WIDTH - x - BattleTroop.CELL_WIDTH * 4;
        }

        battleUnit = new BattleUnit(this.game, x, y, unit.getAssetKey(), side);
        this._battleUnits[unitIndex] = battleUnit;
        this.addChild(battleUnit);
    }, this);
};

BattleTroop.prototype.getBattleUnit = function(unitIndex) {
    return this._battleUnits[unitIndex];
};

module.exports = BattleTroop;
