'use strict';

var Panel = require('./panel');
var Button = require('../button');
var textUtil = require('../text-util');
var Troop = require('../troop');
var _ = {
    padLeft: require('lodash/string/padLeft')
};

function TroopFormationSetupPanel(game, x, y) {
    Panel.call(this, game, x, y, TroopFormationSetupPanel.WIDTH, TroopFormationSetupPanel.HEIGHT);

    this._buttons = [];

    this.events.onFormationChange = new Phaser.Signal();
    this.events.onTacticChange = new Phaser.Signal();
}

TroopFormationSetupPanel.prototype = Object.create(Panel.prototype);

TroopFormationSetupPanel.WIDTH = 284;
TroopFormationSetupPanel.HEIGHT = 30;

TroopFormationSetupPanel.prototype.render = function(troop) {
    if (troop) {
        this._troop = troop;
    }

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
    var self = this;
    var game = this.game;
    var formationButton = new Button(game, 7, 4, 62, 22);
    var textConfig = { type: 'value', scale: 1.5, parent: formationButton };

    formationButton.value = this._troop.formationIndex;
    formationButton.render();
    formationButton.addChild(new Phaser.Image(game, 5, 3, 'formation-icon'));
    this._formationText = textUtil.renderText(game, 37, 7, _.padLeft(formationButton.value + 1, 2, 0), textConfig);
    this._buttons.push(this.addChild(formationButton));

    formationButton.events.onInputDown.add(function(){
        formationButton.value = formationButton.value >= 15 ? 0 : (formationButton.value + 1);
        self._formationText.setText(_.padLeft(formationButton.value + 1, 2, 0));
        self.events.onFormationChange.dispatch(formationButton.value);
    });
};

TroopFormationSetupPanel.prototype._renderTacticButton = function() {
    var self = this;
    var game = this.game;
    var tacticButton = new Button(game, 71, 4, 62, 22);
    var textConfig = { type: 'value', scale: 2, parent: tacticButton };

    tacticButton.value = this._troop.tactic;
    tacticButton.render();
    tacticButton.addChild(new Phaser.Image(game, 4, 4, 'tactic-icon'));
    this._tacticText = textUtil.renderText(game, 44, 5, tacticButton.value.substr(0,1).toUpperCase(), textConfig);
    this._buttons.push(this.addChild(tacticButton));

    tacticButton.events.onInputDown.add(function(){
        switch (tacticButton.value) {
        case Troop.Tactic.NORMAL:
            tacticButton.value = Troop.Tactic.SCOUT;
            break;
        case Troop.Tactic.SCOUT:
            tacticButton.value = Troop.Tactic.ALERT;
            break;
        case Troop.Tactic.ALERT:
            tacticButton.value = Troop.Tactic.NORMAL;
            break;
        }
        self._tacticText.setText(tacticButton.value.substr(0,1).toUpperCase());
        self.events.onTacticChange.dispatch(tacticButton.value);
    });
};

TroopFormationSetupPanel.prototype._renderWeaponButton = function() {
    var game = this.game;
    var weaponButton = new Button(game, 135, 4, 22, 22);

    weaponButton.render();
    weaponButton.addChild(new Phaser.Image(game, 2, 2, 'weapon-icon'));
    this._buttons.push(this.addChild(weaponButton));
};

TroopFormationSetupPanel.prototype._renderProtectionButton = function() {
    var game = this.game;
    var protectionButton = new Button(game, 159, 4, 22, 22);

    protectionButton.render();
    protectionButton.addChild(new Phaser.Image(game, 2, 2, 'protection-icon'));
    this._buttons.push(this.addChild(protectionButton));
};

TroopFormationSetupPanel.prototype._renderItemButton = function() {
    var game = this.game;
    var itemButton = new Button(game, 183, 4, 22, 22);

    itemButton.render();
    itemButton.addChild(new Phaser.Image(game, 2, 2, 'item-icon'));
    this._buttons.push(this.addChild(itemButton));
};

TroopFormationSetupPanel.prototype._renderMemberButton = function() {
    var game = this.game;
    var memberButton = new Button(game, 207, 4, 22, 22);

    memberButton.render();
    memberButton.addChild(new Phaser.Image(game, 2, 2, 'member-icon'));
    this._buttons.push(this.addChild(memberButton));
};

TroopFormationSetupPanel.prototype._renderSelectedText = function() {
    var game = this.game;
    textUtil.renderText(game, 255, 13, 'MEMBER', { type: 'value', align: 'center', parent: this });
};

module.exports = TroopFormationSetupPanel;
