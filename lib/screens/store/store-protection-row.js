'use strict';

var StoreRow = require('./store-row');
var protections = require('../../../configs/protections');

function StoreProtectionRow(game, x, y, offer) {
    this._protection = protections[offer.key];

    StoreRow.call(this, game, x, y, offer);
}

StoreProtectionRow.prototype = Object.create(StoreRow.prototype);

StoreProtectionRow.prototype._renderRowItem = function() {
    this._renderRowItemImage(7, this._offer.key, 'icons');
};

StoreProtectionRow.prototype._getRowItemName = function() {
    return this._protection.name;
};

StoreProtectionRow.prototype._getRowItemPrice = function() {
    return this._protection.price;
};

StoreProtectionRow.prototype._renderRowItemAttributes = function() {
    var protection = this._protection;

    this._renderAttributes(42, 18, {
        key: 'protection',
        pad: 3,
        separator: ':',
        parent: this,
        attrs: [{
            key: 'type',
            data: { name: 'TYPE', value: protection.typeName.toUpperCase() },
            nextLine: 1,
            pad: 0,
            separator: ' '
        }, {
            key: 'atk',
            data: { name: 'PROTECT', value: protection.protect },
            nextSpace: 2
        }]
    });
};

module.exports = StoreProtectionRow;
