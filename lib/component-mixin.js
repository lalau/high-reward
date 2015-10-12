'use strict';

var componentMixin = {};

componentMixin._renderUnitImage = function(x, y, unit, key, parent) {
    var image = this[key];
    var imageKey;

    if (unit === null) {
        if (image) {
            image.destroy();
            this[key] = null;
        }
        return;
    }

    imageKey = unit.getAssetKey() + '-stand';

    if (image) {
        if (image.key === imageKey) {
            return image;
        }
        image.destroy();
    }

    this[key] = new Phaser.Image(this.game, x, y, imageKey);
    parent = parent || this;
    return parent.addChild(this[key]);
};

module.exports = componentMixin;
