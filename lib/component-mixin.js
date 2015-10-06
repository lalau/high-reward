'use strict';

var componentMixin = {};

componentMixin._renderUnitImage = function(x, y, unit, key, parent) {
    var imageKey;

    if (unit === null) {
        if (this[key]) {
            this[key].destroy();
            this[key] = null;
        }
        return;
    }

    imageKey = unit.getAssetKey() + '-stand';

    if (this[key]) {
        if (this[key].key === imageKey) {
            return;
        }
        this[key].destroy();
    }

    this[key] = new Phaser.Image(this.game, x, y, imageKey);
    parent = parent || this;
    parent.addChild(this[key]);
};

module.exports = componentMixin;
