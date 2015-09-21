'use strict';

var EasyStar = require('./easystar');

function Pathfinder(grid) {
    var easystar = new EasyStar.js();
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([0]);
    easystar.setSearchDeltas([
        { x: -2, y: -1 },
        { x: -1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: -1 }
    ]);

    this._easystar = easystar;
}

Pathfinder.prototype.findPath = function(startX, startY, endX, endY, callback) {
    var easystar = this._easystar;

    if (startX === endX && startY === endY) {
        callback();
        return;
    }

    easystar.findPath(startX, startY, endX, endY, callback);
    easystar.calculate();
};

module.exports = Pathfinder;
