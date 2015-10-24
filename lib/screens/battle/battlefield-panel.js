'use strict';

function BattlefieldPanel(game, x, y, troop1, troop2) {
    Phaser.Group.call(this, game, null, 'battlefield');

    this.x = x;
    this.y = y;

    this._troop1 = troop1;
    this._troop2 = troop2;

    this._render();
}

BattlefieldPanel.prototype = Object.create(Phaser.Group.prototype);

BattlefieldPanel.WIDTH = 576;
BattlefieldPanel.HEIGHT = 168;
BattlefieldPanel.PADDING = 8;

BattlefieldPanel.prototype._render = function() {
    var battlefieldImage = this.addChild(new Phaser.Image(this.game, 0, 0, 'battlefield'));
    var battleTroopGroup = this.addChild(new BattleTroopGroup(this.game, BattlefieldPanel.PADDING, 0, this._troop2, 'left'));
    var battleTroopGroup = this.addChild(new BattleTroopGroup(this.game, BattlefieldPanel.WIDTH - BattleTroopGroup.WIDTH - BattlefieldPanel.PADDING, 0, this._troop1, 'right'));
};

/////////////

var formations = require('../../../configs/formations');
var BattleUnit = require('../../components/battle-unit');

function BattleTroopGroup(game, x, y, troop, side) {
    Phaser.Group.call(this, game, null, 'battlefield');

    this.x = x;
    this.y = y;

    this._side = side;
    this._troop = troop;

    this._render();
}

BattleTroopGroup.WIDTH = 256;
BattleTroopGroup.HEIGHT = 168;

BattleTroopGroup.CELL_WIDTH = 16;
BattleTroopGroup.CELL_HEIGHT = 17;

BattleTroopGroup.prototype = Object.create(Phaser.Group.prototype);

BattleTroopGroup.prototype._render = function() {
    var troop = this._troop;
    var formationIndex = troop.formationIndex;

    formations[formationIndex].slots.forEach(function(slot, slotIndex){
        var unit = troop.getUnitAt(troop.formation[slotIndex]);
        var side = this._side;
        var x;
        var y;

        if (!unit) {
            return;
        }

        x = slot.gx * BattleTroopGroup.CELL_WIDTH;
        y = slot.gy * BattleTroopGroup.CELL_HEIGHT;

        if (side === 'left') {
            x = BattleTroopGroup.WIDTH - x - BattleTroopGroup.CELL_WIDTH * 4;
        }

        this.addChild(new BattleUnit(this.game, x, y, unit.getAssetKey(), side));
    }, this);
};

module.exports = BattlefieldPanel;
