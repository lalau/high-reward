'use strict';

var STATES = require('../../configs/states');
var SelectMenu = require('../menus/select-menu');
var OverlayState = require('./overlay-state');
var tweenUtil = require('../utils/tween-util');
var graphicUtil = require('../utils/graphic-util');
var Panel = require('../components/panel');
var textUtil = require('../utils/text-util');
var MemberRow = require('../components/member-row');

function BattleSelectUnit(game) {
    OverlayState.call(this, game);

    this.game = game;
}

BattleSelectUnit.prototype = Object.create(OverlayState.prototype);

BattleSelectUnit.prototype.init = function(battleScreen) {
    this._battleScreen = battleScreen || this._battleScreen;
};

BattleSelectUnit.prototype._getMenu = function() {
    var menu = {
        title: 'UNIT',
        options: [
            { key: 'retreat', text: 'Retreat' }
        ]
    };

    return menu;
};

BattleSelectUnit.prototype.create = function() {
    OverlayState.prototype.create.call(this);

    var game = this.game;
    var screen = this._battleScreen;
    var menu = this._getMenu();
    var selectMenu = new SelectMenu(game, 'center', 'center', 'auto', menu);

    selectMenu.onClick('retreat', function() {
        screen.retreatBattleUnit(this._selectedTroopIndex, this._selectedUnitIndex);
        game.state.start(STATES.BattleSelectUnit);
    }, this);

    selectMenu.visible = false;
    this._selectMenu = game.stage.addChild(selectMenu);

    this._createInfoPanel();

    screen.toggleSelectUnit(true);
    screen.onUnitSelect.add(this._handleUnitSelect, this);
};

BattleSelectUnit.prototype._handleUnitSelect = function(troopIndex, unitIndex) {
    var game = this.game;
    var clickMask = game.stage.addChild(graphicUtil.getClickMask(game));
    var selectMenu = this._selectMenu;
    var infoPanel = this._infoPanel;
    var unit = this._battleScreen.getUnit(troopIndex, unitIndex);

    clickMask.input.priorityID = 100;
    clickMask.events.onInputDown.addOnce(function() {
        tweenUtil.fadeIn(infoPanel);
        tweenUtil.fadeOut(selectMenu, function() {
            clickMask.destroy();
            selectMenu.visible = false;
        });
        this._unitPanel.destroy();
        this._unitPanel = null;
        this._selectedTroopIndex = null;
        this._selectedUnitIndex = null;
    }, this);
    this._unitSelectClickMask = clickMask;

    selectMenu.visible = true;
    tweenUtil.fadeIn(selectMenu);
    tweenUtil.fadeOut(infoPanel);
    this._createUnitPanel(unit, unitIndex);
    this._selectedTroopIndex = troopIndex;
    this._selectedUnitIndex = unitIndex;
};

BattleSelectUnit.prototype._createInfoPanel = function() {
    var game = this.game;
    var infoPanel = new Panel(game, 10, 349, 244, 46);
    textUtil.renderText(game, Panel.X_PADDING, 3, 'Select Unit', { scale: 1.5, type: 'value', parent: infoPanel });

    tweenUtil.fadeIn(game.stage.addChild(infoPanel));
    this._infoPanel = infoPanel;
};

BattleSelectUnit.prototype._createUnitPanel = function(unit, unitIndex) {
    var game = this.game;
    var unitPanel = new Panel(game, 10, 349, 244, 46);

    unitPanel.addChild(new MemberRow(game, Panel.X_PADDING, 3, unit, unitIndex, { view: 'battle' }));
    tweenUtil.fadeIn(game.stage.addChild(unitPanel));
    this._unitPanel = unitPanel;
};

BattleSelectUnit.prototype.shutdown = function() {
    var screen = this._battleScreen;

    OverlayState.prototype.shutdown.call(this);

    this._infoPanel.destroy();
    this._selectMenu.destroy();
    if (this._unitSelectClickMask) {
        this._unitSelectClickMask.destroy();
    }
    if (this._unitPanel) {
        this._unitPanel.destroy();
    }

    screen.toggleSelectUnit(false);
    screen.remove(this._handleUnitSelect, this);
};

module.exports = BattleSelectUnit;
