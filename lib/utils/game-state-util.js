'use strict';

var gameStateUtil = {};

gameStateUtil.getNewState = function() {
    return {
        introduced: false,
        currentRegion: 'zelerd'
    };
};

module.exports = gameStateUtil;
