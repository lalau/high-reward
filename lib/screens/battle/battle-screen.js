'use strict';

var TroopHpPanel = require('./troop-hp-panel');
var BattlefieldPanel = require('./battlefield-panel');

function BattleScreen(game, troop1, troop2) {
    Phaser.Group.call(this, game, null, 'battle-screen');

    this._troop1 = troop1;
    this._troop2 = troop2;
    this._panels = {
        troop1Hp: this.addChild(new TroopHpPanel(game, 338, 65, troop1, 'right')),
        troop2Hp: this.addChild(new TroopHpPanel(game, 34, 65, troop2, 'left')),
        battlefield: this.addChild(new BattlefieldPanel(game, 32, 150, troop1, troop2))
    };
}

BattleScreen.prototype = Object.create(Phaser.Group.prototype);

var roundCount = 0;

BattleScreen.prototype.start = function() {
    roundCount++;

    var candidateUnits = getCandidateUnits(this._troop1, this._troop2);

    console.log(roundCount, candidateUnits);
};

function getCandidateUnits(troop1, troop2) {
    var candidates = [];
    var weaponSpeed = 9;

    troop1.members.forEach(function(unit) {
        unit.battleAttrs = unit.battleAttrs || {
            lastFiringRound: 0
        };
        var probabilityToFire = (weaponSpeed/100)*(1+(roundCount - unit.battleAttrs.lastFiringRound)*unit.attrs.shoot/100);
        var willFire = Math.random() < probabilityToFire;

        if (willFire) {
            unit.battleAttrs.lastFiringRound = roundCount;
            candidates.push(unit);
        }
    });

    return candidates;
}

module.exports = BattleScreen;
