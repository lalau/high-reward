'use strict';

var scripts = require('../../configs/scripts/information');
var _ = {
    forEach: require('lodash/collection/forEach'),
    template: require('lodash/string/template')
};

_.forEach(scripts, function(templates, key) {
    scripts[key] = templates.map(function(template) {
        return _.template(template);
    });
});

var infoUtil = {};

infoUtil.getMessage = function(key, config) {
    return scripts[key] && scripts[key][0] && scripts[key][0](config);
};

module.exports = infoUtil;
