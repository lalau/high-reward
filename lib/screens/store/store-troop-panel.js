'use strict';

var Panel = require('../../components/panel');
var Button = require('../../components/button');
var UnitSlot = require('../../components/unit-slot');
var graphicUtil = require('../../utils/graphic-util');

function StoreTroopPanel(game, x, y, troop, store) {
    Panel.call(this, game, x, y, StoreTroopPanel.WIDTH, StoreTroopPanel.HEIGHT);

    this._troop = troop;
    this._store = store;

    this._render();
}

StoreTroopPanel.prototype = Object.create(Panel.prototype);

StoreTroopPanel.WIDTH = 108;
StoreTroopPanel.HEIGHT = 270;

StoreTroopPanel.prototype._render = function() {
    this._renderButtons();
    this._renderMembers();
};

StoreTroopPanel.prototype._renderButtons = function() {
    this.events.onUnitSlotToggle = new Phaser.Signal();

    this._buttons = [];
    this._renderWeaponButton();
    this._renderProtectionButton();
    this._renderItemButton();
    this._renderMemberButton();
};

StoreTroopPanel.prototype._renderWeaponButton = function() {
    var game = this.game;
    var weaponButton = new Button(game, 7, 4, 22, 22);

    weaponButton.addChild(new Phaser.Image(game, 2, 2, 'weapon-icon'));
    weaponButton.events.onInputDown.add(this.enableSubSlot.bind(this, 'weapon'));
    this._buttons.push(this.addChild(weaponButton));
};

StoreTroopPanel.prototype._renderProtectionButton = function() {
    var game = this.game;
    var protectionButton = new Button(game, 31, 4, 22, 22);

    protectionButton.addChild(new Phaser.Image(game, 2, 2, 'protection-icon'));
    protectionButton.events.onInputDown.add(this.enableSubSlot.bind(this, 'protection'));
    this._buttons.push(this.addChild(protectionButton));
};

StoreTroopPanel.prototype._renderItemButton = function() {
    var game = this.game;
    var itemButton = new Button(game, 55, 4, 22, 22);

    itemButton.addChild(new Phaser.Image(game, 2, 2, 'item-icon'));
    itemButton.events.onInputDown.add(this.enableSubSlot.bind(this, 'item'));
    this._buttons.push(this.addChild(itemButton));
};

StoreTroopPanel.prototype._renderMemberButton = function() {
    var game = this.game;
    var memberButton = new Button(game, 79, 4, 22, 22);

    memberButton.addChild(new Phaser.Image(game, 2, 2, 'member-icon'));
    memberButton.events.onInputDown.add(this.disableSubSlot, this);
    this._buttons.push(this.addChild(memberButton));
};

StoreTroopPanel.prototype.enableSubSlot = function(type) {
    this._unitSlots.forEach(function(unitSlot) {
        unitSlot.enableSubSlot(type);
    });
    this.events.onUnitSlotToggle.dispatch(type);
};

StoreTroopPanel.prototype.disableSubSlot = function() {
    this._unitSlots.forEach(function(unitSlot) {
        unitSlot.disableSubSlot();
    });
    this.events.onUnitSlotToggle.dispatch('agency');
};

StoreTroopPanel.prototype._renderMembers = function() {
    var troop = this._troop;
    var storeType = this._store.type;
    var commanderSlot = new UnitSlot(this.game, 38, 29, troop.formation.indexOf(0), troop.getUnitAt(0), 0);
    var slotX = 14;
    var slotY = 69;
    var memberIndex;
    var unit;
    var unitSlot;

    this._unitSlots = [];

    this.addChild(commanderSlot);
    if (storeType !== 'agency') {
        commanderSlot.enableSubSlot(storeType);
        this._unitSlots.push(commanderSlot);
    }

    for (memberIndex = 1; memberIndex < 11; memberIndex++) {
        unit = troop.getUnitAt(memberIndex);
        unitSlot = new UnitSlot(this.game, slotX, slotY, troop.formation.indexOf(memberIndex), unit, memberIndex);
        if (storeType !== 'agency') {
            unitSlot.enableSubSlot(storeType);
        }
        this._unitSlots.push(this.addChild(unitSlot));
        if (memberIndex % 2 === 1) {
            slotX += 40;
        } else {
            slotX -= 40;
            slotY += 40;
        }
    }
};

StoreTroopPanel.prototype.updateMembers = function(updateMemberIndex) {
    this._unitSlots.forEach(function(unitSlot) {
        var memberIndex = unitSlot.getMemberIndex();
        var unit = this._troop.getUnitAt(memberIndex);

        if (unit !== unitSlot.getUnit() || memberIndex === updateMemberIndex) {
            unitSlot.setUnit(unit, memberIndex);
        }
    }, this);
};

StoreTroopPanel.prototype.enableInput = function(shouldEnable) {
    var inputTarget = this._store.type === 'agency' ? 'unit' : 'sub';

    this._unitSlotsInputSetup = this._inputSetup || [];

    this._unitSlots.forEach(function(unitSlot, index) {
        if (shouldEnable && !shouldEnable(unitSlot)) {
            unitSlot.disableInput();
            return;
        }

        unitSlot.enableInput(inputTarget);

        if (this._unitSlotsInputSetup[index]) {
            return;
        }

        unitSlot.events.onInputOver.add(this._renderHoverState, this);
        unitSlot.events.onInputOut.add(this._removeHoverState, this);
        unitSlot.events.onInputDown.add(this._removeHoverState, this);
        unitSlot.events.onInputDown.add(this._dispatchUnitSlotDown, this);

        this._unitSlotsInputSetup[index] = true;
    }, this);

    if (!this.events.onUnitSlotOver) {
        this.events.onUnitSlotOver = new Phaser.Signal();
        this.events.onUnitSlotOut = new Phaser.Signal();
        this.events.onUnitSlotDown = new Phaser.Signal();
    }
};

StoreTroopPanel.prototype._renderHoverState = function(unitSlot) {
    var isHoverUnit = this._store.type === 'agency';
    var hoverTargetWidth = isHoverUnit ? UnitSlot.WIDTH : UnitSlot.SUBSLOT_WIDTH;
    var hoverTargetX = (isHoverUnit ? 0 : UnitSlot.SUBSLOT_X) + unitSlot.x;
    var hoverTargetY = (isHoverUnit ? 0 : UnitSlot.SUBSLOT_Y) + unitSlot.y;

    if (this._hoverState) {
        this._hoverState.visible = true;
    } else {
        hoverTargetWidth =

        this._hoverState = graphicUtil.getHoverBorder(this.game, hoverTargetX, hoverTargetY, hoverTargetWidth, hoverTargetWidth);
        this.addChild(this._hoverState);
    }

    this._hoverState.x = hoverTargetX;
    this._hoverState.y = hoverTargetY;
    this.events.onUnitSlotOver.dispatch(unitSlot);
};

StoreTroopPanel.prototype._removeHoverState = function() {
    if (!this._hoverState) {
        return;
    }

    this._hoverState.visible = false;
    this.events.onUnitSlotOut.dispatch();
};

StoreTroopPanel.prototype._dispatchUnitSlotDown = function(unitSlot) {
    this.events.onUnitSlotDown.dispatch(unitSlot.getMemberIndex());
};

StoreTroopPanel.prototype.disableInput = function() {
    this._unitSlots.forEach(function(unitSlot) {
        unitSlot.disableInput();
    });
};

module.exports = StoreTroopPanel;
