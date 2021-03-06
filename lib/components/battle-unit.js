'use strict';

function BattleUnit(game, x, y, unit, side) {
    Phaser.Group.call(this, game, null, 'battle-unit');

    this.x = x;
    this.y = y;
    this._config = {
        x: x,
        y: y,
        side: side
    };

    this._unitSprite = this._createUnitSprite(unit.getAssetKey(), unit.weapon);
    this.onUnitKilled = new Phaser.Signal();
}

BattleUnit.WIDTH = 64;
BattleUnit.HEIGHT = 32;

BattleUnit.prototype = Object.create(Phaser.Group.prototype);

BattleUnit.prototype._createUnitSprite = function(unitKey, withWeapon) {
    var unitSprite = withWeapon ? this._createFiringSprite(unitKey) : this._createWeaponlessSprite(unitKey);

    if (this._config.side === 'left') {
        unitSprite.scale.x = -1;
        unitSprite.anchor.x = 1;
    }

    this.addChild(unitSprite);
    return unitSprite;
};

BattleUnit.prototype._createFiringSprite = function(unitKey) {
    var framePrefix = unitKey + '-fire-';
    var frame1 = framePrefix + 1 + '.png';
    var frame2 = framePrefix + 2 + '.png';
    var unitSprite = new Phaser.Sprite(this.game, 0, 0, 'sprites', frame1);

    unitSprite.animations.add('fire', [frame1, frame2, frame1]);

    return unitSprite;
};

BattleUnit.prototype._createWeaponlessSprite = function(unitKey) {
    var frame = unitKey + '-weaponless.png';
    var unitSprite = new Phaser.Sprite(this.game, 0, 0, 'sprites', frame);

    return unitSprite;
};

BattleUnit.prototype.animateFire = function() {
    var unitSprite = this._unitSprite;
    return unitSprite.play('fire', 4);
};

BattleUnit.prototype.animateHit = function(isCritical) {
    var hitSprite = this._hitSprite;

    this._isCriticalHit = isCritical;

    if (!hitSprite) {
        hitSprite = new Phaser.Sprite(this.game, 18, 0, 'sprites');

        if (this._config.side === 'left') {
            hitSprite.scale.x = -1;
            hitSprite.x = BattleUnit.WIDTH - hitSprite.x;
        }

        this._setupHitAnimation(hitSprite);
        this.addChild(hitSprite);
        this._hitSprite = hitSprite;
    } else if (!hitSprite.visible) {
        hitSprite.revive();
    }

    return hitSprite.play('action', 4, false, true);
};

BattleUnit.prototype.animateCriticalHit = function() {
    this.animateHit(true);
};

BattleUnit.prototype._setupHitAnimation = function(hitSprite) {
    var hitAnimation = hitSprite.animations.add('action', ['hit-1.png', 'hit-2.png', 'hit-3.png']);
    var side = this._config.side;

    hitAnimation.enableUpdate = true;
    hitAnimation.onStart.add(function() {
        if (this._isCriticalHit) {
            this.x = this._config.x + (side === 'left' ? -5 : 5);
        }
        this.y = this._config.y - 1;
    }, this);
    hitAnimation.onUpdate.add(function(animation, frame) {
        if (frame.index === 1) {
            if (this._isCriticalHit) {
                this.x = this._config.x + (side === 'left' ? -9 : 9);
            }
            this.y = this._config.y + 1;
        } else if (frame.index === 2) {
            if (this._isCriticalHit) {
                this.x = this._config.x + (side === 'left' ? -5 : 5);
            }
            this.y = this._config.y;
        }
    }, this);
    hitAnimation.onComplete.add(function() {
        this.x = this._config.x;
        this.y = this._config.y;
        this._isCriticalHit = false;
    }, this);
};

BattleUnit.prototype.animateMiss = function() {
    var missSprite = this._missSprite;
    var missPosition = this._getMissPosition();

    if (!missSprite) {
        missSprite = new Phaser.Sprite(this.game, missPosition.x, missPosition.y, 'sprites');

        if (this._config.side === 'left') {
            missSprite.scale.x = -1;
        }

        missSprite.animations.add('action', ['miss-1.png', 'miss-2.png', 'miss-3.png']);
        this.addChild(missSprite);
        this._missSprite = missSprite;
    } else if (!missSprite.visible) {
        missSprite.position = missPosition;
        missSprite.revive();
    }

    return missSprite.play('action', 4, false, true);
};

BattleUnit.prototype._getMissPosition = function() {
    var missPosition = {
        x: Math.floor(Math.random() * 30),
        y: Math.floor(Math.random() * 20) + 12
    };

    if (this._config.side === 'left') {
        missPosition.x = BattleUnit.WIDTH - missPosition.x;
    }

    return missPosition;
};

BattleUnit.prototype.animateDie = function() {
    var dieSprite = new Phaser.Sprite(this.game, 0, 0, 'sprites');

    dieSprite.animations.add('action', ['die-1.png', 'die-2.png', 'die-3.png', 'die-4.png', 'die-5.png']);
    this._unitSprite.kill();
    this.addChild(dieSprite);
    dieSprite.events.onKilled.add(function() {
        this.onUnitKilled.dispatch();
    }, this);

    return dieSprite.play('action', 4, false, true);
};

module.exports = BattleUnit;
