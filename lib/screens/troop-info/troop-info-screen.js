'use strict';

var CommanderPanel = require('./troop-commander-panel');
var InfoPanel = require('./troop-info-panel');
var MembersPanel = require('./troop-members-panel');

function TroopInfoScreen(game, troop) {
    Phaser.Group.call(this, game, null, 'troop-info-screen');

    this._troop = troop;
    this._panels = {
        commander: this.addChild(new CommanderPanel(game, 10, 49, troop.commander)),
        info: this.addChild(new InfoPanel(game, 154, 49, troop)),
        members: this.addChild(new MembersPanel(game, 154, 145, troop))
    };
}

TroopInfoScreen.prototype = Object.create(Phaser.Group.prototype);

TroopInfoScreen.prototype.setTroop = function(troop) {
    this._troop = troop;
    this._updatePanels();
};

TroopInfoScreen.prototype._updatePanels = function() {
    var troop = this._troop;
    var panels = this._panels;

    panels.commander.setCommander(troop.commander);
    panels.info.setTroop(troop);
    panels.members.setTroop(troop);
};

module.exports = TroopInfoScreen;
