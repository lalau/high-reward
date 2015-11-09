'use strict';

var formations = require('../../configs/formations');
var battleUtil = require('./battle-util');
var WEAPON_SPEED = 9;

function BattleController(troop1, troop2) {
    this._round = 0;
    this._troops = [troop1, troop2];

    this._candidatesWaitingToFire = [];
    this._firingCandidates = [];
    this._suppressedUnits = [];

    this._initBattleAttrs(troop1, 'left');
    this._initBattleAttrs(troop2, 'right');

    this.onEnd = new Phaser.Signal();
}

BattleController.prototype.nextRound = function() {
    if (this._handleBattleEnd()) {
        return;
    }

    this._round++;
    this._handleFire();

    var candidates = this._getFireCandidates();

    candidates.sort(this._compareCandidateSpeed);
    candidates = this._candidatesWaitingToFire.concat(candidates);
    this._candidatesWaitingToFire = [];
    candidates.forEach(this._setFireTarget, this);
    this._setFiringCandidates(candidates);
};

BattleController.prototype._handleBattleEnd = function() {
    if (this._wonTroopIndex !== undefined) {
        return true;
    }

    this._troops.forEach(function(troop, troopIndex) {
        if (!this._troops[troopIndex].isAlive()) {
            this._wonTroopIndex = troopIndex ? 0 : 1;
        }
    }, this);

    if (this._wonTroopIndex !== undefined) {
        this._processBattleAttrs();
        this.onEnd.dispatch();
        return true;
    }
};

BattleController.prototype._handleFire = function() {
    var currentCandidates = [];
    this._suppressedUnits = [];

    this._firingCandidates.forEach(function(candidate) {
        if (candidate.startFiring) {
            candidate.fireStatus = battleUtil.computeFire(candidate.unit, candidate.target);
            candidate.startFiring = false;
            candidate.suppressingRound = 3;
        }  else {
            candidate.fireStatus = undefined;
        }

        if (candidate.suppressingRound) {
            candidate.suppressingRound--;
            if (candidate.suppressingRound > 0) {
                currentCandidates.push(candidate);
                this._suppressedUnits.push(candidate.target);
            }
        } else {
            candidate.unit.battleAttrs.lastFiringRound = this._round;
        }
    }, this);

    currentCandidates.forEach(function(candidate) {
        if (candidate.target.battleAttrs.isDead) {
            candidate.suppressingRound = 1;
        }
    });

    this._firingCandidates = currentCandidates;
    this._suppressedUnits = this._suppressedUnits.filter(function(unit) {
        return !unit.battleAttrs.isDead;
    });
    this._candidatesWaitingToFire = this._candidatesWaitingToFire.filter(function(candidate) {
        return !candidate.unit.battleAttrs.isDead;
    });
};

BattleController.prototype._getFireCandidates = function() {
    var candidates = [];

    this._troops.forEach(function(troop, troopIndex) {
        troop.members.forEach(function(unit, unitIndex) {
            if (unit && !this._isActive(unit) && !unit.battleAttrs.isDead && this._willUnitFire(unit)) {
                candidates.push({
                    troopIndex: troopIndex,
                    unit: unit,
                    unitIndex: unitIndex
                });
            }
        }, this);
    }, this);

    return candidates;
};

BattleController.prototype._isActive = function(unit) {
    return this._isUnitInCandidates(this._candidatesWaitingToFire, unit) || this._isUnitInCandidates(this._firingCandidates, unit);
};

BattleController.prototype._compareCandidateSpeed = function(candidate1, candidate2) {
    if (candidate1.unit.attrs.shoot > candidate2.unit.attrs.shoot) {
        return -1;
    }
    if (candidate1.unit.attrs.shoot < candidate2.unit.attrs.shoot) {
        return 1;
    }
    if (candidate1.unit.attrs.shoot === candidate2.unit.attrs.shoot) {
        return Math.random() < 0.5;
    }
};

BattleController.prototype._setFireTarget = function(candidate) {
    var troopIndex = candidate.troopIndex;
    var troop = this._troops[troopIndex];
    var slotIndex = troop.getSlotIndex(candidate.unit);
    var slots = formations[troop.formationIndex].slots;
    var gPosition = slots[slotIndex];
    var targetTroopIndex = troopIndex ? 0 : 1;
    var targetTroop = this._troops[targetTroopIndex];
    var targetUnit = this._getTargetUnit(targetTroop, gPosition.gy);

    if (targetUnit) {
        candidate.target = targetUnit;
        candidate.targetTroopIndex = targetTroopIndex;
        candidate.targetUnitIndex = targetTroop.getMemberIndex(targetUnit);
    }
};

BattleController.prototype._getTargetUnit = function(troop, initialGy, tiltCount) {
    tiltCount = tiltCount || 0;

    var gy = initialGy + (tiltCount % 2 ? -1 : 1) * Math.ceil(tiltCount / 2);
    var slots = formations[troop.formationIndex].slots;
    var targetSlot = null;
    var targetUnit;
    var unit;

    if (gy >= 0 && gy <= 9) {
        slots.forEach(function(slot) {
            if (slot.gy === gy) {
                if (targetSlot === null || (targetSlot.gx > slot.gx)) {
                    unit = troop.getMemberAtSlot(slots.indexOf(slot));
                    if (unit && !unit.battleAttrs.isDead) {
                        targetSlot = slot;
                    }
                }
            }
        });
    }

    if (targetSlot) {
        targetUnit = troop.getMemberAtSlot(slots.indexOf(targetSlot));
        if (this._isUnitInCandidates(this._firingCandidates, targetUnit)) {
            targetUnit = null;
        }
    }

    if (targetUnit) {
        return targetUnit;
    } else {
        if (tiltCount < 20) {
            return this._getTargetUnit(troop, initialGy, tiltCount + 1);
        }
    }
};

BattleController.prototype._isUnitInCandidates = function(candidates, unit) {
    return candidates.some(function(candidate) {
        return candidate.unit === unit;
    });
};

BattleController.prototype._setFiringCandidates = function(candidates) {
    candidates.forEach(function(candidate) {
        var unit = candidate.unit;

        if (this._suppressedUnits.indexOf(unit) >= 0) {
            candidate.target = undefined;
        }

        if (candidate.target && this._isUnitInCandidates(this._firingCandidates, candidate.target)) {
            candidate.target = undefined;
        }

        if (!candidate.target) {
            this._candidatesWaitingToFire.push(candidate);
        } else {
            candidate.startFiring = true;
            this._firingCandidates.push(candidate);
            this._suppressedUnits.push(candidate.target);
        }
    }, this);
};

BattleController.prototype._willUnitFire = function(unit) {
    return Math.random() < ((WEAPON_SPEED / 100) * (1 + (this._round - unit.battleAttrs.lastFiringRound) * unit.attrs.shoot / 100));
};

BattleController.prototype._initBattleAttrs = function(troop, side) {
    troop.members.forEach(function(unit) {
        if (unit) {
            unit.battleAttrs = {
                lastFiringRound: 0
            };
        }
    });
    troop.battleAttrs = {
        side: side
    };
};

BattleController.prototype._processBattleAttrs = function() {
    this._troops.forEach(function(troop) {
        troop.battleAttrs = undefined;
        troop.members.forEach(function(unit, unitIndex) {
            if (unit) {
                if (unit.battleAttrs.isDead && unit.type !== 'commander') {
                    troop.removeMember(unitIndex);
                }
                unit.battleAttrs = undefined;
            }
        });
    });
};

BattleController.prototype.getStatus = function() {
    if (this._wonTroopIndex !== undefined) {
        return {
            wonTroopIndex: this._wonTroopIndex
        };
    }

    return {
        round: this._round,
        firingCandidates: this._firingCandidates,
        suppressedUnits: this._suppressedUnits,
        candidatesWaitingToFire: this._candidatesWaitingToFire
    };
};

module.exports = BattleController;
