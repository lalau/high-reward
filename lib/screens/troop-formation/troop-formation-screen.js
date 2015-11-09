'use strict';

var SetupPanel = require('./troop-formation-setup-panel');
var FormationPanel = require('./troop-formation-panel');
var InfoPanel = require('./troop-formation-info-panel');
var TitlePanel = require('./troop-formation-title-panel');

function TroopFormationScreen(game, troop) {
    Phaser.Group.call(this, game, null, 'troop-formation-screen');

    this._troop = troop;
    this._panels = {
        setup: this.addChild(new SetupPanel(game, 178, 17, troop)),
        info: this.addChild(new InfoPanel(game, 178, 265)),
        title: this.addChild(new TitlePanel(game, 178, 361, troop)),
        formation: this.addChild(new FormationPanel(game, 178, 49, troop))
    };

    this._initPanelEvents();
}

TroopFormationScreen.prototype = Object.create(Phaser.Group.prototype);

TroopFormationScreen.prototype._initPanelEvents = function() {
    var panels = this._panels;

    panels.formation.events.onMovingUnitStart.add(this._handleMovingUnitStart, this);
    panels.formation.events.onMovingUnitEnd.add(this._handleMovingUnitEnd, this);
};

TroopFormationScreen.prototype._handleMovingUnitStart = function(unit) {
    var panels = this._panels;

    panels.setup.disableButtons();
    panels.info.setUnit(unit);
};

TroopFormationScreen.prototype._handleMovingUnitEnd = function() {
    var panels = this._panels;

    panels.setup.enableButtons();
    panels.info.setUnit(null);
};

module.exports = TroopFormationScreen;
