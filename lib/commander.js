'use strict';

var Unit = require('./unit');
var commanders = require('../configs/commanders');

function Commander(config) {
    var key = config.key;

    config = config.attributes ? config : commanders[key];

    Unit.call(this, config);

    this.type = 'commander';
    this.fullName = config.fullName;
    this.shortName = config.shortName;
    this.troopName = config.troopName;
}

Commander.prototype = Object.create(Unit.prototype);

Commander.prototype.getAssetKey = function() {
    return this.key;
};

module.exports = Commander;
