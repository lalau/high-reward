'use strict';

var BattleTroop = require('../../components/battle-troop');

function BattlefieldPanel(game, x, y, troop1, troop2) {
    Phaser.Group.call(this, game, null, 'battlefield');

    this.x = x;
    this.y = y;

    this._troops = [troop1, troop2];

    this.onHit = new Phaser.Signal();
    this.onRecover = new Phaser.Signal();
    this.onRetreat = new Phaser.Signal();

    this._render();
}

BattlefieldPanel.prototype = Object.create(Phaser.Group.prototype);

BattlefieldPanel.WIDTH = 576;
BattlefieldPanel.HEIGHT = 168;
BattlefieldPanel.PADDING = 8;

BattlefieldPanel.prototype._render = function() {
    var leftTroopX = BattlefieldPanel.PADDING;
    var rightTroopX = BattlefieldPanel.WIDTH - BattleTroop.WIDTH - BattlefieldPanel.PADDING;

    this.addChild(new Phaser.Image(this.game, 0, 0, 'screens', 'battlefield.png'));

    this._battleTroops = [
        this.addChild(new BattleTroop(this.game, leftTroopX, 0, this._troops[0], 'left')),
        this.addChild(new BattleTroop(this.game, rightTroopX, 0, this._troops[1], 'right', {
            enableInput: true
        }))
    ];

    this.onUnitSelect = new Phaser.Signal();
    this._battleTroops[1].onUnitSelect.add(function(unitIndex) {
        this.onUnitSelect.dispatch(1, unitIndex);
    }, this);
};

BattlefieldPanel.prototype.renderStatus = function(status, callback) {
    if (!status) {
        callback();
        return;
    }

    var fireRendered = 0;
    var hitRendered = 0;
    var missRendered = 0;
    var retreatRendered = 0;
    var totalFireRender = status.firingCandidates.length;
    var totalHitRender = 0;
    var totalMissRender = 0;
    var totalRetreatRender = status.retreatingUnits.length;
    var recoverCount = status.recoveringCandidates.length;
    var calledBack = false;
    var timeoutHandle;

    if (totalFireRender === 0 && totalRetreatRender === 0 && recoverCount === 0) {
        callback();
        return;
    }

    function callbackIfComplete() {
        if (fireRendered >= totalFireRender && hitRendered >= totalHitRender && missRendered >= totalMissRender && retreatRendered >= totalRetreatRender) {
            if (!calledBack) {
                callback();
                clearTimeout(timeoutHandle);
            }
        }
    }

    // in case animation get stuck for some reasons, continue to callback after 2 seconds
    timeoutHandle = setTimeout(function() {
        calledBack = true;
        callback();
    }, 2000);

    status.recoveringCandidates.forEach(function(candidate) {
        this.onRecover.dispatch({
            troopIndex: candidate.troopIndex,
            unitIndex: candidate.unitIndex
        });
    }, this);

    status.retreatingUnits.forEach(function(retreat) {
        var troopIndex = retreat.troopIndex;
        var unitIndex = retreat.unitIndex;
        var battleTroop = this._battleTroops[troopIndex];
        var battleUnit = battleTroop.getBattleUnit(unitIndex);
        var dieAnimation = battleUnit.animateDie();

        this.onRetreat.dispatch({
            troopIndex: troopIndex,
            unitIndex: unitIndex
        });

        dieAnimation.onComplete.addOnce(function() {
            retreatRendered++;
            callbackIfComplete();
        }, this);
    }, this);

    status.firingCandidates.forEach(function(candidate) {
        if (candidate.unit.battleAttrs.isRetreated) {
            totalFireRender--;
            callbackIfComplete();
        }

        var self = this;
        var firingUnit = this._battleTroops[candidate.troopIndex].getBattleUnit(candidate.unitIndex);
        var targetUnit = this._battleTroops[candidate.targetTroopIndex].getBattleUnit(candidate.targetUnitIndex);

        setTimeout(function() {
            var fireAnimation = firingUnit.animateFire();
            fireAnimation.onComplete.addOnce(function() {
                fireRendered++;
                callbackIfComplete();
            });
        }, Math.random()*1000);

        if (!candidate.fireStatus) {
            return;
        }

        if (candidate.fireStatus.damage) {
            totalHitRender++;
            setTimeout(function() {
                var targetHp = candidate.target.attrs.hp;
                var hitAnimation = targetUnit.animateHit(candidate.fireStatus.isCritical);
                var dispatch = function() {
                    self.onHit.dispatch({
                        troopIndex: candidate.targetTroopIndex,
                        unitIndex: candidate.targetUnitIndex
                    });
                };
                if (targetHp > 0) {
                    dispatch();
                }
                hitAnimation.onComplete.addOnce(function() {
                    hitRendered++;
                    callbackIfComplete();
                    if (candidate.target.attrs.hp === 0) {
                        dispatch();
                        targetUnit.animateDie();
                    }
                });
            }, Math.random()*1000);
        } else if (candidate.fireStatus.missed) {
            totalMissRender++;
            setTimeout(function() {
                var missAnimation = targetUnit.animateMiss();
                missAnimation.onComplete.addOnce(function() {
                    missRendered++;
                    callbackIfComplete();
                });
            }, Math.random()*1000);
        }
    }, this);
};

BattlefieldPanel.prototype.toggleSelect = function(enabled) {
    this._battleTroops[1].toggleSelect(enabled);
};

BattlefieldPanel.prototype.setRetreatUnit = function(troopIndex, unitIndex) {
    var battleTroop = this._battleTroops[troopIndex];
    battleTroop.setSelectedUnit(unitIndex);
    battleTroop.destroyUnitSelect(unitIndex);
};

module.exports = BattlefieldPanel;
