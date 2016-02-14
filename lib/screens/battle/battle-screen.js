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

    this._panels.battlefield.onHit.add(this._updateHpPanel, this);
    this._panels.battlefield.onRecover.add(this._updateHpPanel, this);
    this._panels.battlefield.onRetreat.add(function(params) {
        this._updateHpPanel(params, true);
    }, this);

    this._battle = new Battle(this._troops[0], this._troops[1]);

    this.onBattleEnd = new Phaser.Signal();
    this.onUnitSelect = this._panels.battlefield.onUnitSelect;
}

BattleScreen.prototype = Object.create(Phaser.Group.prototype);

BattleScreen.prototype.start = function() {
    this._nextRound();
};

BattleScreen.prototype.pause = function() {
    this._paused = true;
};

BattleScreen.prototype.resume = function() {
    this._paused = false;

    if (!this._isRenderingStatus) {
        this._nextRound();
    }
};

BattleScreen.prototype.stop = function() {
    this._battle.end();
    this._nextRound();
};

BattleScreen.prototype.toggleSelectUnit = function(enabled) {
    this._panels.battlefield.toggleSelect(enabled);
};

BattleScreen.prototype.isPaused = function() {
    return !!this._paused;
};

BattleScreen.prototype.retreatBattleUnit = function(troopIndex, unitIndex) {
    this._battle.retreatUnit(troopIndex, unitIndex);
    this._panels.battlefield.setRetreatUnit(troopIndex, unitIndex);
};

BattleScreen.prototype.getUnit = function(troopIndex, unitIndex) {
    return this._troops[troopIndex].getUnitAt(unitIndex);
};

BattleScreen.prototype._nextRound = function() {
    var self = this;
    var status;

    this._battle.nextRound();
    status = this._battle.getStatus();

    if (status.wonTroopIndex !== undefined) {
        this.onBattleEnd.dispatch(status);
        return;
    }

    this._isRenderingStatus = true;
    this._panels.battlefield.renderStatus(status, function() {
        self._isRenderingStatus = false;
        if (!self._paused) {
            self._nextRound();
        }
    });
};

BattleScreen.prototype._updateHpPanel = function(params, remove) {
    this._panels.troopHp[params.troopIndex].updateHpStatus(params.unitIndex, remove);
};

module.exports = BattleScreen;
