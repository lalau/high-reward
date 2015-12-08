'use strict';

var Unit = require('./unit');
var commanders = require('../../configs/commanders');

function Commander(config) {
    var key = config.key;
    var commanderConfig = commanders[key];

    Unit.call(this, {
        key: key,
        unitConfig: commanderConfig,
        attrs: config.attrs
    });

    this.type = 'commander';
    this.shortName = commanderConfig.shortName;
    this.troopName = commanderConfig.troopName;
}

Commander.prototype = Object.create(Unit.prototype);

Commander.prototype.getTypeConfig = function() {
    return commanders[this.key];
};

module.exports = Commander;
