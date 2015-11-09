'use strict';

var units = require('../../configs/units');
var _ = {
    clone: require('lodash/lang/clone')
};

function Unit(config) {
    var key = config.key;
    var baseConfig = config.baseConfig || units[key];

    this.key = baseConfig.key;
    this.type = baseConfig.type;

    if (config.attrs) {
        this.attrs = config.attrs;
    } else {
        this.attrs = _.clone(baseConfig.attributes);
        this.attrs.maxHp = this.attrs.hp;
        this.attrs.fatigue = 0;
    }
}

Unit.prototype.getAssetKey = function() {
    return units[this.key].assetKey;
};

Unit.prototype.getPay = function() {
    return Math.floor(this.getPrice() / 5);
};

Unit.prototype.getPrice = function() {
    var attrs = this.attrs;

    return Math.floor(200 * ((attrs.maxHp / 16) * (attrs.shoot / 8) * (attrs.defence / 8)));
};

module.exports = Unit;
