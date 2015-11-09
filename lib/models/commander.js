'use strict';

var Unit = require('./unit');
var commanders = require('../../configs/commanders');

function Commander(config) {
    var key = config.key;
    var baseConfig = commanders[key];

    Unit.call(this, {
        key: key,
        baseConfig: baseConfig,
        attrs: config.attrs
    });

    this.type = 'commander';
    this.fullName = baseConfig.fullName;
    this.shortName = baseConfig.shortName;
    this.troopName = baseConfig.troopName;
}

Commander.prototype = Object.create(Unit.prototype);

Commander.prototype.getAssetKey = function() {
    return this.key;
};

module.exports = Commander;
