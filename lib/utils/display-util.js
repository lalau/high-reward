'use strict';

var _ = {
    find: require('lodash/collection/find')
};

var displayUtil = {};

displayUtil.getDisplayChild = function(parent, Type) {
    return _.find(parent.children, function(child) {
        return child instanceof Type;
    });
};

module.exports = displayUtil;
