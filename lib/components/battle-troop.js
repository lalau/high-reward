'use strict';

var formations = require('../../configs/formations');
var BattleUnit = require('./battle-unit');
var _ = {
    forEach: require('lodash/collection/forEach')
};

function BattleTroop(game, x, y, troop, side, config) {
    Phaser.Group.call(this, game, null, 'battlefield');

    this.x = x;
    this.y = y;

    this._side = side;
    this._troop = troop;
    this._enableInput = config && config.enableInput;
    this._battleUnits = {};

    this._render();
}

BattleTroop.WIDTH = 256;
BattleTroop.HEIGHT = 168;

BattleTroop.CELL_WIDTH = 16;
BattleTroop.CELL_HEIGHT = 17;

BattleTroop.prototype = Object.create(Phaser.Group.prototype);

BattleTroop.prototype._render = function() {
    var side = this._side;
    var troop = this._troop;
    var formationIndex = troop.formationIndex;

    if (this._enableInput) {
        this._setupSelectView();
        this.onUnitSelect = new Phaser.Signal();
        this._selectHandles = {};
    }

    formations[formationIndex].slots.forEach(function(slot, slotIndex){
        var unitIndex = troop.formation[slotIndex];
        var unit = troop.getUnitAt(unitIndex);
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

        this._battleUnits[unitIndex] = this._renderUnit(unit, x, y);

        if (this._enableInput) {
            this._selectHandles[unitIndex] = this._setupSelectHandle(unitIndex, x, y);
        }
    }, this);
};

BattleTroop.prototype._renderUnit = function(unit, x, y) {
    return this.addChild(new BattleUnit(this.game, x, y, unit, this._side));
};

// create click-able mask on the battle unit
BattleTroop.prototype._setupSelectHandle = function(unitIndex, x, y) {
    var selectHandle;

    if (this._side === 'right') {
        x += BattleUnit.HEIGHT;
    }

    selectHandle = this.addChild(new Phaser.Graphics(this.game, x, y));
    selectHandle.hitArea = new Phaser.Polygon([
        { x: 0, y: 0 },
        { x: 0, y: BattleUnit.HEIGHT },
        { x: BattleUnit.HEIGHT, y: BattleUnit.HEIGHT },
        { x: BattleUnit.HEIGHT, y: 0 }
    ]);

    selectHandle.events.onInputOver.add(function() {
        this.toggleSelectView(true, unitIndex);
    }, this);
    selectHandle.events.onInputOut.add(function() {
        this.toggleSelectView(false);
    }, this);
    selectHandle.events.onInputDown.add(function() {
        this.onUnitSelect.dispatch(unitIndex);
    }, this);
    selectHandle.events.onInputUp.add(function() {
        this.toggleSelectView(true, unitIndex);
        // clear some input detection issues by refreshing the input enable status
        this._toggleSelectHandle(false, selectHandle);
        this._toggleSelectHandle(true, selectHandle);
    }, this);

    return selectHandle;
};

// destroy the clickable mask on the battle unit
BattleTroop.prototype.destroyUnitSelect = function(unitIndex) {
    var selectHandle = this._selectHandles[unitIndex];

    if (selectHandle) {
        selectHandle.destroy();
        this._selectHandles[unitIndex] = undefined;
    }
};

// setup the square border for marking battle unit selection
BattleTroop.prototype._setupSelectView = function() {
    var selectView = this.addChild(new Phaser.Graphics(this.game, 0, 0));

    selectView.lineStyle(1, 0xFFAA75, 1);
    selectView.drawRect(0, 0, BattleUnit.HEIGHT, BattleUnit.HEIGHT);
    selectView.visible = false;

    this._selectView = selectView;
};

// enable/disable a select mask
BattleTroop.prototype._toggleSelectHandle = function(enabled, selectHandle) {
    if (!selectHandle) {
        return;
    }

    selectHandle.inputEnabled = enabled;
    if (enabled) {
        selectHandle.input.priorityID = 10;
    }
};

// enable/disable maskes to take input, i.e. enable/disable selecting unit
BattleTroop.prototype.toggleSelect = function(enabled) {
    if (!this._selectHandles) {
        return;
    }

    _.forEach(this._selectHandles, this._toggleSelectHandle.bind(this, enabled));
    if (!enabled) {
        this.toggleSelectView(false);
    }
};

// move the selection border to the unit of the unitIndex
BattleTroop.prototype.toggleSelectView = function(enabled, unitIndex) {
    var selectView = this._selectView;
    var selectHandle = this._selectHandles[unitIndex];

    if (enabled) {
        if (selectHandle) {
            selectView.x = selectHandle.x;
            selectView.y = selectHandle.y;
            selectView.visible = true;
        }
    } else {
        selectView.visible = false;
    }
};

BattleTroop.prototype.getBattleUnit = function(unitIndex) {
    return this._battleUnits[unitIndex];
};

BattleTroop.prototype.setSelectedUnit = function(unitIndex) {
    this._battleUnits[unitIndex].alpha = 0.75;
};

module.exports = BattleTroop;
