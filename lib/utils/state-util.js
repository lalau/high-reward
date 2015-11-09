'use strict';

function StateUtil(game) {
    this.game = game;
    this._stack = [];

    game.state.onStateChange.add(this.handleStateChange, this);
}

StateUtil.prototype.back = function() {
    this.game.state.start(this._stack[this._stack.length - 2]);
};

StateUtil.prototype.handleStateChange = function(newState) {
    var stack = this._stack;
    var indexOfNewState = stack.indexOf(newState);

    if (indexOfNewState >= 0) {
        stack.length = indexOfNewState + 1;
    } else {
        stack.push(newState);
    }
};

module.exports = StateUtil;
