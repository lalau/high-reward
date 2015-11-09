'use strict';

var timeUtil = {};

timeUtil.getPointerFrame = function(game) {
    var worldHour = game.gameState.worldTime.hour();
    var frame = worldHour <= 12 ? worldHour : 24 - worldHour;

    return frame;
};

timeUtil.incrementHour = function(game) {
    game.gameState.worldTime.add(1, 'h');
};

timeUtil.getFormattedDate = function(game) {
    return game.gameState.worldTime.format('YYYY/MM/DD');
};

module.exports = timeUtil;
