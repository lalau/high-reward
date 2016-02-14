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
    this._recoveringCandidates = [];
    this._retreatingUnits = [];

    this._initBattleAttrs(troop1, 'left');
    this._initBattleAttrs(troop2, 'right');
}

BattleController.prototype.nextRound = function() {
    if (this._handleBattleEnd()) {
        return;
    }

    if (!this._startHpTotals) {
        this._startHpTotals = this._getHpTotals();
    }

    this._round++;
    this._recoveringCandidates = [];
    // units retreats in the next round
    // "retreating units" are units going to retreat in this round
    // "retreating candidates" are units asked to retreat from the last round
    this._retreatingUnits = this._retreatingCandidates || [];
    this._retreatingCandidates = [];
    this._handleFire();

    var candidates = this._getFireCandidates();

    candidates.sort(this._compareCandidateSpeed);
    candidates = this._candidatesWaitingToFire.concat(candidates);
    this._candidatesWaitingToFire = [];
    candidates.forEach(this._setFireTarget, this);
    this._setFiringCandidates(candidates);
};

BattleController.prototype.end = function() {
    if (this._wonTroopIndex === undefined) {
        this._wonTroopIndex = -1;
        this._handleBattleEnd();
    }
};

BattleController.prototype.retreatUnit = function(troopIndex, unitIndex) {
    var troop = this._troops[troopIndex];
    var unit = troop && troop.members[unitIndex];

    if (!unit) {
        return;
    }

    if (unit.type === 'commander') {
        this.end();
        return;
    }

    unit.battleAttrs.isRetreated = true;
    this._retreatingCandidates = this._retreatingCandidates || [];
    this._retreatingCandidates.push({
        troopIndex: troopIndex,
        unitIndex: unitIndex
    });
};

BattleController.prototype._handleBattleEnd = function() {
    if (this._wonTroopIndex !== undefined) {
        // handle case when _wonTroopIndex is set by retreating
        this._processBattleAttrs();
        return true;
    }

    this._troops.forEach(function(troop, troopIndex) {
        if ((troop.commander && troop.commander.attrs.hp <= 0) || !troop.isAlive()) {
            this._wonTroopIndex = troopIndex ? 0 : 1;
        }
    }, this);

    if (this._wonTroopIndex !== undefined) {
        // handle case when _wonTroopIndex is set by win/lose above
        this._processBattleAttrs();
        return true;
    }
};

BattleController.prototype._executeFire = function(candidate) {
    var target = candidate.target;
    var fireStatus = battleUtil.computeFire(candidate.unit, target);
    var item = target && target.items[0];

    if (fireStatus.damage) {
        target.attrs.hp = Math.max(target.attrs.hp - fireStatus.damage, 0);
    }

    if (fireStatus.expert) {
        candidate.unit.attrs.expertRaw += fireStatus.expert;
    }

    if (item && item.type === 'recovery' && (item.amount <= (target.attrs.maxHp - target.attrs.hp) || target.attrs.hp <= 0)) {
        target.attrs.hp = Math.min(target.attrs.hp + item.amount, target.attrs.maxHp);
        target.items.shift();
        this._recoveringCandidates.push({
            troopIndex: candidate.targetTroopIndex,
            unit: target,
            unitIndex: candidate.targetUnitIndex
        });
    }

    if (target.attrs.hp <= 0) {
        target.battleAttrs.isDead = true;
    }

    return fireStatus;
};

BattleController.prototype._handleFire = function() {
    var currentCandidates = [];
    this._suppressedUnits = [];

    this._firingCandidates.forEach(function(candidate) {
        if (candidate.startFiring) {
            candidate.fireStatus = this._executeFire(candidate);
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
        var battleAttrs = candidate.target.battleAttrs;

        if (battleAttrs.isDead || battleAttrs.isRetreated) {
            candidate.suppressingRound = 1;
        }
    });

    this._firingCandidates = currentCandidates;
    this._suppressedUnits = this._suppressedUnits.filter(function(unit) {
        var battleAttrs = unit.battleAttrs;
        return !battleAttrs.isDead && !battleAttrs.isRetreated;
    });
    this._candidatesWaitingToFire = this._candidatesWaitingToFire.filter(function(candidate) {
        var battleAttrs = candidate.unit.battleAttrs;
        return !battleAttrs.isDead && !battleAttrs.isRetreated;
    });
};

BattleController.prototype._getFireCandidates = function() {
    var candidates = [];

    this._troops.forEach(function(troop, troopIndex) {
        troop.members.forEach(function(unit, unitIndex) {
            var battleAttrs = unit && unit.battleAttrs;
            if (unit && unit.weapon && !this._isActive(unit) && battleAttrs && !battleAttrs.isDead && !battleAttrs.isRetreated && this._willUnitFire(unit)) {
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
    var battleAttrs;

    if (gy >= 0 && gy <= 9) {
        slots.forEach(function(slot) {
            if (slot.gy === gy) {
                if (targetSlot === null || (targetSlot.gx > slot.gx)) {
                    unit = troop.getMemberAtSlot(slots.indexOf(slot));
                    battleAttrs = unit && unit.battleAttrs;
                    if (battleAttrs && !battleAttrs.isDead && !battleAttrs.isRetreated) {
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
            if (unit && unit.battleAttrs) {
                if (unit.battleAttrs.isDead) {
                    if (unit.type !== 'commander') {
                        troop.removeMember(unitIndex);
                    }
                } else {
                    unit.updateExperts();
                }
                unit.battleAttrs = undefined;
            }
        });
    });
};

BattleController.prototype._getHpTotals = function() {
    return this._troops.map(function(troop) {
        return troop.getTotalHp();
    });
};

BattleController.prototype.getStatus = function() {
    if (this._wonTroopIndex !== undefined) {
        return {
            wonTroopIndex: this._wonTroopIndex,
            startHpTotals: this._startHpTotals,
            endHpTotals: this._getHpTotals()
        };
    }

    return {
        round: this._round,
        firingCandidates: this._firingCandidates,
        suppressedUnits: this._suppressedUnits,
        candidatesWaitingToFire: this._candidatesWaitingToFire,
        recoveringCandidates: this._recoveringCandidates,
        retreatingUnits: this._retreatingUnits
    };
};

module.exports = BattleController;
