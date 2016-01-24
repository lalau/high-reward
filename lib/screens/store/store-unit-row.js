'use strict';

var StoreRow = require('./store-row');
var Unit = require('../../models/unit');
var _ = {
    padLeft: require('lodash/string/padLeft')
};

function StoreUnitRow(game, x, y, offer) {
    this._unit = new Unit(offer);

    StoreRow.call(this, game, x, y, offer);
}

StoreUnitRow.prototype = Object.create(StoreRow.prototype);

StoreUnitRow.prototype._renderRowItem = function() {
    this._renderRowItemImage(3, this._unit.getAssetKey() + '-stand', 'sprites');
};

StoreUnitRow.prototype._getRowItemName = function() {
    return this._unit.name;
};

StoreUnitRow.prototype._getRowItemPrice = function() {
    return this._unit.getPrice();
};

StoreUnitRow.prototype._renderRowItemAttributes = function() {
    var unit = this._unit;
    var attrs = unit.attrs;

    this._renderAttributes(42, 18, {
        key: 'unit',
        pad: 3,
        parent: this,
        attrs: [{
            key: 'hp',
            data: { name: 'HP', value: attrs.hp },
            nextSpace: 1
        }, {
            key: 'sht',
            data: { name: 'S', value: attrs.shoot },
            nextSpace: 1
        }, {
            key: 'def',
            data: { name: 'D', value: attrs.defence },
            nextSpace: 3
        }, {
            key: 'pay',
            data: { name: 'PAY', value: ':' + _.padLeft(unit.getPay(), 5, ' ') },
            pad: 0,
            nextLine: 1
        }, {
            key: 'exp',
            data: { name: 'EXPERT', value: unit.getExpert() },
            nextSpace: 1
        }, {
            key: 'trd',
            data: { name: 'T', value: attrs.trading },
            nextSpace: 1
        }, {
            key: 'perf',
            data: { name: 'P', value: attrs.performance },
            nextSpace: 1
        }, {
            key: 'bld',
            data: { name: 'B', value: attrs.building }
        }]
    });
};

module.exports = StoreUnitRow;
