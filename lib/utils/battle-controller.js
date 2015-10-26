'use strict';

var formations = require('../../configs/formations');
var WEAPON_SPEED = 9;

function BattleController(troop1, troop2) {
    this._round = 0;
    this._troops = [troop1, troop2];

    this._candidatesWaitingToFire = [];
    this._firingCandidates = [];
    this._suppressedUnits = [];

    this._initBattleAttrs(troop1, 'left');
    this._initBattleAttrs(troop2, 'right');
}

BattleController.prototype.nextRound = function() {
    this._round++;
    this._handleFire();

    var round = this._round;
    var candidates = this._getFireCandidates();

    candidates.sort(this._compareCandidateSpeed);
    candidates = this._candidatesWaitingToFire.concat(candidates);
    this._candidatesWaitingToFire = [];
    candidates.forEach(this._setFireTarget, this);
    this._setFiringCandidates(candidates);
};

BattleController.prototype._handleFire = function() {
    var currentCandidates = [];
    this._suppressedUnits = [];

    this._firingCandidates.forEach(function(candidate) {
        if (candidate.startFiring) {
            this._fire(candidate.unit, candidate.target);
            candidate.startFiring = false;
            candidate.suppressingRound = 3;
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

    this._suppressedUnits = this._suppressedUnits.filter(function(unit) {
        return !unit.battleAttrs.isDead;
    });
    this._firingCandidates = currentCandidates.filter(function(candidate) {
        if (candidate.target.battleAttrs.isDead) {
            candidate.suppressingRound = 0;
            return false;
        }
        return true;
    });
    this._candidatesWaitingToFire = this._candidatesWaitingToFire.filter(function(candidate) {
        return !candidate.unit.battleAttrs.isDead;
    });
};

BattleController.prototype._fire = function(unit1, unit2) {
    if (Math.random() < 0.1) {
        return;
    }

    unit2.attrs.hp -= this._getDamage(unit1.attrs.shoot, unit2.attrs.defence);
    unit2.attrs.hp = Math.max(0, unit2.attrs.hp);

    if (!unit2.attrs.hp) {
        unit2.battleAttrs.isDead = true;
    }
};

BattleController.prototype._getDamage = function(attack, defense) {
    return Math.max(0,
        Math.min(attack + this._rollDice(2, 2), attack + this._rollDice(2, 2)) -
        Math.floor(
            (defense + this._rollDice(2, 2)) * 0.2
        )
    );
};

BattleController.prototype._rollDice = function(count, sides) {
    var value = 0;

    while(count--) {
        value += Math.floor(Math.random() * (sides + 1));
    }

    return value;
}

BattleController.prototype._getFireCandidates = function() {
    var candidates = [];

    this._troops.forEach(function(troop, troopIndex) {
        troop.members.forEach(function(unit, unitIndex) {
            if (!this._isActive(unit) && !unit.battleAttrs.isDead && this._willUnitFire(unit)) {
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
    var targetTroop = this._troops[troopIndex ? 0 : 1];
    var targetUnit = this._getTargetUnit(targetTroop, gPosition.gy);

    if (targetUnit) {
        candidate.target = targetUnit;
    }
};

BattleController.prototype._getTargetUnit = function(troop, initialGy, tiltCount) {
    tiltCount = tiltCount || 0;

    var gy = initialGy + (tiltCount % 2 ? -1 : 1) * Math.ceil(tiltCount / 2);
    var slots = formations[troop.formationIndex].slots;
    var targetSlot = null;
    var targetUnit;

    if (gy >= 0 && gy <= 9) {
        slots.forEach(function(slot, slotIndex) {
            if (slot.gy === gy) {
                if (targetSlot === null || (troop.battleAttrs.side === 'left' && slot.gx > targetSlot.gx) || (troop.battleAttrs.side === 'right' && targetSlot.gx > slot.gx)) {
                    if (!troop.getMemberAtSlot(slots.indexOf(slot)).battleAttrs.isDead) {
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
        if (tiltCount < 19) {
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
        unit.battleAttrs = {
            lastFiringRound: 0
        };
    });
    if (troop.commander) {
        troop.commander.battleAttrs = {
            lastFiringRound: 0
        }
    }
    troop.battleAttrs = {
        side: side
    };
};

BattleController.prototype.end = function() {
    this._troops.forEach(function(troop) {
        troop.battleAttrs = undefined;
        troop.commander.battleAttrs = undefined;
        troop.members.forEach(function(unit) {
            unit.battleAttrs = undefined;
        });
    });
};

BattleController.prototype.getStatus = function() {
    return {
        round: this._round,
        firingCandidates: this._firingCandidates,
        suppressedUnits: this._suppressedUnits,
        candidatesWaitingToFire: this._candidatesWaitingToFire
    }
};

module.exports = BattleController;
