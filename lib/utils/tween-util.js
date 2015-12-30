'use strict';

var tweenUtil = {};

tweenUtil.fadeIn = function(target, callback) {
    target.alpha = 0;

    var tween = target.game.add.tween(target).to({ alpha: 1 }, 200, null, true);

    if (callback) {
        tween.onComplete.add(callback);
    }

    return target;
};

tweenUtil.fadeOut = function(target, callback) {
    target.alpha = 1;

    var tween = target.game.add.tween(target).to({ alpha: 0 }, 200, null, true);

    if (callback) {
        tween.onComplete.add(callback);
    }

    return target;
};

module.exports = tweenUtil;
