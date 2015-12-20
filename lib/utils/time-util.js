'use strict';

var timeUtil = {};
var _ = {
    padLeft: require('lodash/string/padLeft')
};

timeUtil.getPointerFrame = function(game) {
    var worldHour = game.gameState.worldTime.hour();
    var frameIndex = worldHour <= 12 ? worldHour : 24 - worldHour;

    return 'clock-' + _.padLeft(frameIndex, 2, 0) + '.png';
};

timeUtil.incrementHour = function(game) {
    game.gameState.worldTime.add(1, 'h');
};

timeUtil.getFormattedDate = function(game) {
    return game.gameState.worldTime.format('YYYY/MM/DD');
};

module.exports = timeUtil;
