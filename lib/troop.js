'use strict';

var _ = {
    fill: require('lodash/array/fill')
};

function Troop(config) {
    this.name = config.name;

    this.members = config.members || [];
    this.members.length = 10;
    _.fill(this.members, undefined);

    this.order = Troop.Order.STAY;
    this.move = Troop.Move.ON_FOOT;
    this.tactic = Troop.Tactic.ALERT;
}

Troop.prototype.getPay = function() {
    return 120;
};

Troop.Order = {};
Troop.Order.STAY = 'stay';
Troop.Order.IDLE = 'idle';
Troop.Order.RETREAT = 'retreat';

Troop.Move = {};
Troop.Move.ON_FOOT = 'on foot';

Troop.Tactic = {};
Troop.Tactic.ALERT = 'alert';

module.exports = Troop;
