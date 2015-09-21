'use strict';

var units = require('../configs/units');
var _ = {
    clone: require('lodash/lang/clone')
};

function Unit(config) {
    var key = config.key;

    config = config.attributes ? config : units[key];

    this.key = config.key;
    this.type = config.type;

    this.attrs = _.clone(config.attributes);
    this.attrs.maxHp = this.attrs.hp;

    this.attrs.fatigue = 0;
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
