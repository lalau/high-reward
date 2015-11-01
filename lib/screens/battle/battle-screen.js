'use strict';

var TroopHpPanel = require('./troop-hp-panel');
var BattlefieldPanel = require('./battlefield-panel');
var Battle = require('../../utils/battle-controller');

function BattleScreen(game, troop1, troop2) {
    Phaser.Group.call(this, game, null, 'battle-screen');

    this._troops = [troop1, troop2];

    this._panels = {
        troopHp: [
            this.addChild(new TroopHpPanel(game, 34, 65, troop1, 'left')),
            this.addChild(new TroopHpPanel(game, 338, 65, troop2, 'right'))
        ],
        battlefield: this.addChild(new BattlefieldPanel(game, 32, 150, troop1, troop2))
    };

    this._panels.battlefield.onHit.add(function(params) {
        this._panels.troopHp[params.troopIndex].updateHpStatus(params.unitIndex);
    }, this);
}

BattleScreen.prototype = Object.create(Phaser.Group.prototype);

BattleScreen.prototype.start = function() {
    this._battle = new Battle(this._troops[0], this._troops[1]);
    this._nextRound();
};

BattleScreen.prototype.pause = function() {
    this._paused = true;
};

BattleScreen.prototype.resume = function() {
    this._paused = false;
    this._nextRound();
};

BattleScreen.prototype.isPaused = function() {
    return !!this._paused;
};

BattleScreen.prototype._nextRound = function() {
    var self = this;
    var status;

    this._battle.nextRound();
    status = this._battle.getStatus();

    if (status.wonTroopIndex !== undefined) {
        return;
    }

    this._panels.battlefield.renderStatus(status, function() {
        if (!self._paused) {
            self._nextRound();
        }
    });
};

module.exports = BattleScreen;
