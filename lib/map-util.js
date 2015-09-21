'use strict';

var mapUtil = {};

mapUtil.getPointDelta = function(x, y, h, v) {
    return {
        x: x + h - 2*v,
        y: y - h - v
    };
};

mapUtil.getDeltasAtRange = function(range) {
    var d = [];
    var deltas = [];
    var i;

    for (i = -range; i <= range; i++) {
        d.push(i);
    }

    d.forEach(function(dx) {
        d.forEach(function(dy) {
            if (Math.abs(dx) === range || Math.abs(dy) ===range) {
                deltas.push({x: dx, y: dy});
            }
        });
    });

    return deltas;
};

module.exports = mapUtil;
