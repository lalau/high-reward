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

componentMixin._renderPortrait = function(x, y, characterKey) {
    var border = new Phaser.Graphics(this.game, x, y);

    border.lineStyle(1, 0x000000, 1);
    border.drawRect(0, 0, 127, 159);
    this.addChild(border);
    this._renderPortraitImage(x + 1, y + 1, characterKey);
};

componentMixin._renderPortraitImage = function(x, y, characterKey) {
    this._portrait = new Phaser.Image(this.game, x, y, characterKey + '-portrait');
    this.addChild(this._portrait);
};

componentMixin._updatePortrait = function(characterKey) {
    var portraitKey = characterKey + '-portrait';
    var x;
    var y;

    if (this._portrait.key !== portraitKey) {
        x = this._portrait.x;
        y = this._portrait.y;
        this._portrait.destroy();
        this._renderPortraitImage(x, y, characterKey);
    }
};

module.exports = componentMixin;
