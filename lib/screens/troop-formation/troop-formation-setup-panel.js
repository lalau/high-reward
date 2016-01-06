'use strict';

var Panel = require('../../components/panel');
var Button = require('../../components/button');
var textUtil = require('../../utils/text-util');
var Troop = require('../../models/troop');
var _ = {
    padLeft: require('lodash/string/padLeft')
};

function TroopFormationSetupPanel(game, x, y, troop) {
    Panel.call(this, game, x, y, TroopFormationSetupPanel.WIDTH, TroopFormationSetupPanel.HEIGHT);

    this._troop = troop;
    this._buttons = [];

    this.events.onSubSlotSelect = new Phaser.Signal();

    this._render();
}

TroopFormationSetupPanel.prototype = Object.create(Panel.prototype);

TroopFormationSetupPanel.WIDTH = 284;
TroopFormationSetupPanel.HEIGHT = 30;

TroopFormationSetupPanel.prototype._render = function() {
    this._renderFormationButton();
    this._renderTacticButton();
    this._renderWeaponButton();
    this._renderProtectionButton();
    this._renderItemButton();
    this._renderMemberButton();
    this._renderSelectedText();
};

TroopFormationSetupPanel.prototype.enableButtons = function() {
    this._buttons.forEach(function(button) {
        button.enableInput();
    });
};

TroopFormationSetupPanel.prototype.disableButtons = function() {
    this._buttons.forEach(function(button) {
        button.disableInput();
    });
};

TroopFormationSetupPanel.prototype._renderFormationButton = function() {
    var game = this.game;
    var troop = this._troop;
    var formationButton = new Button(game, 7, 4, 62, 22);
    var textConfig = { type: 'value', scale: 1.5, parent: formationButton };

    formationButton.value = troop.formationIndex;
    formationButton.addChild(new Phaser.Image(game, 5, 3, 'icons', 'formation.png'));
    this._formationText = textUtil.renderText(game, 37, 6, _.padLeft(formationButton.value + 1, 2, 0), textConfig);
    this._buttons.push(this.addChild(formationButton));

    formationButton.events.onInputDown.add(function(){
        var formationIndex = formationButton.value >= 15 ? 0 : (formationButton.value + 1);
        formationButton.value = formationIndex;
        this._formationText.setText(_.padLeft(formationIndex + 1, 2, 0));
        troop.formationIndex = formationIndex;
    }, this);
};

TroopFormationSetupPanel.prototype._renderTacticButton = function() {
    var game = this.game;
    var troop = this._troop;
    var tacticButton = new Button(game, 71, 4, 62, 22);
    var textConfig = { type: 'value', scale: 2, parent: tacticButton };

    tacticButton.value = troop.tactic;
    tacticButton.addChild(new Phaser.Image(game, 4, 4, 'icons', 'tactic.png'));
    this._tacticText = textUtil.renderText(game, 44, 4, tacticButton.value.substr(0,1).toUpperCase(), textConfig);
    this._buttons.push(this.addChild(tacticButton));

    tacticButton.events.onInputDown.add(function(){
        var tactic;
        switch (tacticButton.value) {
        case Troop.Tactic.NORMAL:
            tactic = Troop.Tactic.SCOUT;
            break;
        case Troop.Tactic.SCOUT:
            tactic = Troop.Tactic.ALERT;
            break;
        case Troop.Tactic.ALERT:
            tactic = Troop.Tactic.NORMAL;
            break;
        }
        tacticButton.value = tactic;
        this._tacticText.setText(tactic.substr(0,1).toUpperCase());
        troop.tactic = tactic;
    }, this);
};

TroopFormationSetupPanel.prototype._renderWeaponButton = function() {
    var game = this.game;
    var weaponButton = new Button(game, 135, 4, 22, 22);

    weaponButton.addChild(new Phaser.Image(game, 2, 2, 'icons', 'weapon.png'));
    this._buttons.push(this.addChild(weaponButton));

    weaponButton.events.onInputDown.add(function() {
        this.events.onSubSlotSelect.dispatch('weapon');
    }, this);
};

TroopFormationSetupPanel.prototype._renderProtectionButton = function() {
    var game = this.game;
    var protectionButton = new Button(game, 159, 4, 22, 22);

    protectionButton.addChild(new Phaser.Image(game, 2, 2, 'icons', 'protection.png'));
    this._buttons.push(this.addChild(protectionButton));

    protectionButton.events.onInputDown.add(function() {
        this.events.onSubSlotSelect.dispatch('protection');
    }, this);
};

TroopFormationSetupPanel.prototype._renderItemButton = function() {
    var game = this.game;
    var itemButton = new Button(game, 183, 4, 22, 22);

    itemButton.addChild(new Phaser.Image(game, 2, 2, 'icons', 'item.png'));
    this._buttons.push(this.addChild(itemButton));

    itemButton.events.onInputDown.add(function() {
        this.events.onSubSlotSelect.dispatch('item');
    }, this);
};

TroopFormationSetupPanel.prototype._renderMemberButton = function() {
    var game = this.game;
    var memberButton = new Button(game, 207, 4, 22, 22);

    memberButton.addChild(new Phaser.Image(game, 2, 2, 'icons', 'member.png'));
    this._buttons.push(this.addChild(memberButton));

    memberButton.events.onInputDown.add(function() {
        this.events.onSubSlotSelect.dispatch();
    }, this);
};

TroopFormationSetupPanel.prototype._renderSelectedText = function() {
    var game = this.game;
    textUtil.renderText(game, 255, 11, 'MEMBER', { type: 'value', align: 'center', parent: this });
};

module.exports = TroopFormationSetupPanel;
