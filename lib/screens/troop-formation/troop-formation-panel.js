'use strict';

var Panel = require('../../components/panel');
var graphicUtil = require('../../utils/graphic-util');
var textUtil = require('../../utils/text-util');
var UnitSlot = require('../../components/unit-slot');
var formations = require('../../../configs/formations');

function TroopFormationPanel(game, x, y, troop) {
    Panel.call(this, game, x, y, TroopFormationPanel.WIDTH, TroopFormationPanel.HEIGHT);

    this._troop = troop;
    this._movingSlot = null;
    this._movingSlotIndex = null;

    this.events.onMovingUnitStart = new Phaser.Signal();
    this.events.onMovingUnitEnd = new Phaser.Signal();

    this._render();
}

TroopFormationPanel.prototype = Object.create(Panel.prototype);

TroopFormationPanel.WIDTH = 284;
TroopFormationPanel.HEIGHT = 214;
TroopFormationPanel.FORMATION_X = 22;
TroopFormationPanel.FORMATION_Y = 32;
TroopFormationPanel.FORMATION_CELL_WIDTH = 16;
TroopFormationPanel.FORMATION_CELL_HEIGHT = 17;
TroopFormationPanel.UNIT_SUBSLOT_X = UnitSlot.WIDTH;
TroopFormationPanel.UNIT_SUBSLOT_Y = UnitSlot.WIDTH - UnitSlot.SUBSLOT_WIDTH;
TroopFormationPanel.UNIT_SUBSLOT_HIT_AREA = new Phaser.Polygon([
    { x: TroopFormationPanel.UNIT_SUBSLOT_X, y: TroopFormationPanel.UNIT_SUBSLOT_Y },
    { x: TroopFormationPanel.UNIT_SUBSLOT_X, y: TroopFormationPanel.UNIT_SUBSLOT_Y + UnitSlot.SUBSLOT_WIDTH },
    { x: TroopFormationPanel.UNIT_SUBSLOT_X + UnitSlot.SUBSLOT_WIDTH, y: TroopFormationPanel.UNIT_SUBSLOT_Y + UnitSlot.SUBSLOT_WIDTH },
    { x: TroopFormationPanel.UNIT_SUBSLOT_X + UnitSlot.SUBSLOT_WIDTH, y: TroopFormationPanel.UNIT_SUBSLOT_Y }
]);

TroopFormationPanel.prototype._render = function() {
    this._renderTitle();
    this._renderFormation();
};

TroopFormationPanel.prototype._renderTitle = function() {
    var formationName = formations[this._troop.formationIndex].name;

    textUtil.renderText(this.game, Panel.X_PADDING, 5, 'TROOP FORMATION', { parent: this });
    this._nameText = textUtil.renderText(this.game, 70, 16, formationName, { parent: this, scale: 2, type: 'value' });
};

TroopFormationPanel.prototype._renderFormation = function() {
    var formationGroup = new Phaser.Group(this.game, this);
    var formationIndex = this._troop.formationIndex;

    this._formationGroup = this.addChild(formationGroup);
    formations[formationIndex].slots.forEach(this._renderSlot, this);
};

TroopFormationPanel.prototype._renderSlot = function(slot, slotIndex) {
    var troop = this._troop;
    var slotPosition = this._getSlotPosition(slot);
    var memberIndex = troop.formation[slotIndex];
    var unitSlot = new UnitSlot(this.game, slotPosition.x, slotPosition.y, slotIndex, troop.getUnitAt(memberIndex), memberIndex);

    this._formationGroup.addChildAt(unitSlot, slotIndex);
    this._initUnitSlotInput(unitSlot);
};

TroopFormationPanel.prototype.update = function() {
    this._updateTitle();
    this._updateFormation();
};

TroopFormationPanel.prototype._updateTitle = function() {
    var formationName = formations[this._troop.formationIndex].name;

    if (this._nameText.text !== formationName) {
        this._nameText.setText(formationName);
    }
};

TroopFormationPanel.prototype._updateFormation = function() {
    var formationIndex = this._troop.formationIndex;

    this._formationGroup.update();
    formations[formationIndex].slots.forEach(this._updateSlot, this);
};

TroopFormationPanel.prototype._updateSlot = function(slot, slotIndex) {
    var unitSlot = this._formationGroup.getChildAt(slotIndex);
    var unitSlotPosition = this._getSlotPosition(slot);

    if (unitSlot.position.x !== unitSlotPosition.x || unitSlot.position.y !== unitSlotPosition.y) {
        unitSlot.position = unitSlotPosition;
    }
};

TroopFormationPanel.prototype._getSlotPosition = function(slot) {
    return {
        x: TroopFormationPanel.FORMATION_X + slot.gx * TroopFormationPanel.FORMATION_CELL_WIDTH,
        y: TroopFormationPanel.FORMATION_Y + slot.gy * TroopFormationPanel.FORMATION_CELL_HEIGHT
    };
};

TroopFormationPanel.prototype._initUnitSlotInput = function(unitSlot) {
    unitSlot.enableInput();
    unitSlot.events.onInputOver.add(this._renderHoverState, this);
    unitSlot.events.onInputOut.add(this._removeHoverState, this);
    unitSlot.events.onInputDown.add(this._removeHoverState, this);
    unitSlot.events.onInputDown.add(this._handleUnitSlotMove, this);
};

TroopFormationPanel.prototype._handleUnitSlotMove = function(unitSlot) {
    if (this._movingSlotIndex === null) {
        if (this._subSlotType) {
            this._handleSubSlotMoveStart(unitSlot);
        } else {
            this._handleUnitSlotMoveStart(unitSlot);
        }
    } else {
        if (this._subSlotType) {
            this._handleSubSlotMoveEnd(unitSlot);
        } else {
            this._handleUnitSlotMoveEnd(unitSlot);
        }
    }
};

TroopFormationPanel.prototype._handleUnitSlotMoveStart = function(unitSlot) {
    var unit = unitSlot.getUnit();
    var unitImage;

    if (!unit) {
        return;
    }

    this.events.onMovingUnitStart.dispatch(unit);

    unitImage = new Phaser.Image(this.game, 0, 0, 'sprites', unit.getAssetKey() + '-stand.png');
    this._movingImage = unitImage;
    unitImage.anchor = {x: 0.5, y: 0.5};
    this._stickMovingUnitToPointer();
    this.addChild(unitImage, 100);

    this._movingSlot = unitSlot;
    this._movingSlotIndex = unitSlot.getSlotIndex();
    unitSlot.setUnit();

    this.game.input.addMoveCallback(this._stickMovingUnitToPointer, this);
};

TroopFormationPanel.prototype._handleUnitSlotMoveEnd = function(unitSlot) {
    var troop = this._troop;
    var movingSlotIndex = this._movingSlotIndex;
    var movingMemberIndex = troop.getMemberIndexAtSlot(movingSlotIndex);
    var targetMemberIndex = troop.getMemberIndexAtSlot(unitSlot.getSlotIndex());

    troop.swapSlot(movingSlotIndex, unitSlot.getSlotIndex());
    unitSlot.setUnit(troop.getUnitAt(movingMemberIndex), movingMemberIndex);
    this._movingSlot.setUnit(troop.getUnitAt(targetMemberIndex), targetMemberIndex);

    this._movingImage.destroy();
    this._movingImage = null;
    this._movingSlotIndex = null;
    this._movingSlot = null;

    this.game.input.deleteMoveCallback(this._stickMovingUnitToPointer, this);

    this.events.onMovingUnitEnd.dispatch();
};

TroopFormationPanel.prototype._handleSubSlotMoveStart = function(unitSlot) {
    var unit = unitSlot.getUnit();
    var subSlotType = this._subSlotType;
    var subSlotImage;
    var subSlotItem;

    if (unit) {
        if (subSlotType === 'item') {
            subSlotItem = unit.items[0];
        } else {
            subSlotItem = unit[subSlotType];
        }
    }

    if (!subSlotItem) {
        return;
    }

    this.events.onMovingUnitStart.dispatch(unit);

    subSlotImage = new Phaser.Image(this.game, 0, 0, 'icons', subSlotItem.key + '.png');
    this._movingImage = subSlotImage;
    subSlotImage.anchor = {x: 0.5, y: 0.5};
    this._stickMovingUnitToPointer();
    this.addChild(subSlotImage, 100);

    this._movingSlot = unitSlot;
    this._movingSlotIndex = unitSlot.getSlotIndex();
    unitSlot.enableSubSlot('empty', TroopFormationPanel.UNIT_SUBSLOT_X, TroopFormationPanel.UNIT_SUBSLOT_Y);

    this.game.input.addMoveCallback(this._stickMovingUnitToPointer, this);
};

TroopFormationPanel.prototype._handleSubSlotMoveEnd = function(unitSlot) {
    var troop = this._troop;
    var subSlotType = this._subSlotType;
    var movingSlotIndex = this._movingSlotIndex;
    var movingMemberIndex = troop.getMemberIndexAtSlot(movingSlotIndex);
    var targetMemberIndex = troop.getMemberIndexAtSlot(unitSlot.getSlotIndex());

    troop.swapItem(movingMemberIndex, targetMemberIndex, subSlotType);
    unitSlot.enableSubSlot(subSlotType, TroopFormationPanel.UNIT_SUBSLOT_X, TroopFormationPanel.UNIT_SUBSLOT_Y);
    this._movingSlot.enableSubSlot(subSlotType, TroopFormationPanel.UNIT_SUBSLOT_X, TroopFormationPanel.UNIT_SUBSLOT_Y);

    this._movingImage.destroy();
    this._movingImage = null;
    this._movingSlotIndex = null;
    this._movingSlot = null;

    this.game.input.deleteMoveCallback(this._stickMovingUnitToPointer, this);

    this.events.onMovingUnitEnd.dispatch();
};

TroopFormationPanel.prototype._stickMovingUnitToPointer = function() {
    var localPoint = this.toLocal({x: this.game.input.x, y: this.game.input.y});
    var image = this._movingImage;

    image.x = localPoint.x;
    image.y = localPoint.y;
};

TroopFormationPanel.prototype._renderHoverState = function(unitSlot) {
    if (!this._movingSlotIndex && !unitSlot.getUnit()) {
        return;
    }

    var subSlotType = this._subSlotType;
    var borderWidth = subSlotType ? UnitSlot.SUBSLOT_WIDTH : UnitSlot.WIDTH;
    var hoverStateX = unitSlot.x + (subSlotType ? TroopFormationPanel.UNIT_SUBSLOT_X : 0 );
    var hoverStateY = unitSlot.y + (subSlotType ? TroopFormationPanel.UNIT_SUBSLOT_Y : 0 );

    if (this._hoverState) {
        this._hoverState.visible = true;
    } else {
        this._hoverState = graphicUtil.getHoverBorder(this.game, 0, 0, borderWidth, borderWidth);
        this.addChildAt(this._hoverState, 0);
    }

    this._hoverState.x = hoverStateX;
    this._hoverState.y = hoverStateY;
};

TroopFormationPanel.prototype._removeHoverState = function() {
    var hoverState = this._hoverState;

    if (!hoverState) {
        return;
    }

    hoverState.visible = false;
};

TroopFormationPanel.prototype.updateSubSlot = function(type) {
    var formationIndex = this._troop.formationIndex;

    if (!!this._subSlotType !== !!type && this._hoverState) {
        // to force redraw hover state as the size are different for unit slot and subSlot
        this._hoverState.destroy();
        this._hoverState = undefined;
    }

    this._subSlotType = type;

    formations[formationIndex].slots.forEach(function(slot, slotIndex){
        var unitSlot = this._formationGroup.getChildAt(slotIndex);

        if (type) {
            unitSlot.enableSubSlot(type, TroopFormationPanel.UNIT_SUBSLOT_X, TroopFormationPanel.UNIT_SUBSLOT_Y);
            unitSlot.enableInput(TroopFormationPanel.UNIT_SUBSLOT_HIT_AREA);
        } else {
            unitSlot.disableSubSlot();
            unitSlot.enableInput();
        }
    }, this);
};

module.exports = TroopFormationPanel;
