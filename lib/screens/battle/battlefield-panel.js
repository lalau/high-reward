'use strict';

var BattleTroop = require('../../components/battle-troop');

function BattlefieldPanel(game, x, y, troop1, troop2) {
    Phaser.Group.call(this, game, null, 'battlefield');

    this.x = x;
    this.y = y;

    this._troops = [troop1, troop2];

    this.events = this.events || {};
    this.events.onHit = new Phaser.Signal();

    this._render();
}

BattlefieldPanel.prototype = Object.create(Phaser.Group.prototype);

BattlefieldPanel.WIDTH = 576;
BattlefieldPanel.HEIGHT = 168;
BattlefieldPanel.PADDING = 8;

BattlefieldPanel.prototype._render = function() {
    this.addChild(new Phaser.Image(this.game, 0, 0, 'battlefield'));

    this._battleTroops = [
        this.addChild(new BattleTroop(this.game, BattlefieldPanel.PADDING, 0, this._troops[0], 'left')),
        this.addChild(new BattleTroop(this.game, BattlefieldPanel.WIDTH - BattleTroop.WIDTH - BattlefieldPanel.PADDING, 0, this._troops[1], 'right'))
    ];
};

BattlefieldPanel.prototype.renderStatus = function(status, callback) {
    if (status.firingCandidates.length === 0) {
        callback();
        return;
    }

    var fireRendered = 0;
    var hitRendered = 0;
    var missRendered = 0;
    var totalFireRender = status.firingCandidates.length;
    var totalHitRender = 0;
    var totalMissRender = 0;

    function callbackIfComplete() {
        if (fireRendered === totalFireRender && hitRendered === totalHitRender && missRendered === totalMissRender) {
            callback();
        }
    }

    status.firingCandidates.forEach(function(candidate) {
        var self = this;
        var firingUnit = this._battleTroops[candidate.troopIndex].getChildAt(candidate.unitIndex);
        var targetUnit = this._battleTroops[candidate.targetTroopIndex].getChildAt(candidate.targetUnitIndex);

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
                var hitAnimation = targetUnit.animateHit();
                var dispatch = function() {
                    self.events.onHit.dispatch({
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

module.exports = BattlefieldPanel;
