'use strict';

var Unit = require('./unit');
var commanders = require('../../configs/commanders');

function Commander(config) {
    var key = config.key;
    var unitConfig = config.unitConfig || commanders[key];

    Unit.call(this, {
        key: unitConfig.key,
        unitConfig: unitConfig,
        attrs: config.attrs
    });

    this.type = 'commander';
    this.shortName = unitConfig.shortName;
    this.troopName = unitConfig.troopName;
}

Commander.prototype = Object.create(Unit.prototype);

Commander.rehydrate = function(driedCommander) {
    return new Commander(driedCommander);
};

Commander.prototype.dehydrate = function() {
    var driedCommander = Unit.prototype.dehydrate.call(this);

    driedCommander.unitConfig.shortName = this.shortName;
    driedCommander.unitConfig.troopName = this.troopName;

    return driedCommander;
};

Commander.prototype.getTypeConfig = function() {
    return commanders[this.key];
};

module.exports = Commander;
