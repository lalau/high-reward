'use strict';

var StoreRow = require('./store-row');
var items = require('../../../configs/items');

function StoreItemRow(game, x, y, offer) {
    this._item = items[offer.key];

    StoreRow.call(this, game, x, y, offer);
}

StoreItemRow.prototype = Object.create(StoreRow.prototype);

StoreItemRow.prototype._renderRowItem = function() {
    this._renderRowItemImage(7, this._offer.key, 'icons');
};

StoreItemRow.prototype._getRowItemName = function() {
    return this._item.name;
};

StoreItemRow.prototype._getRowItemPrice = function() {
    return this._item.price;
};

StoreItemRow.prototype._renderRowItemAttributes = function() {
    var item = this._item;
    var value = item.amount > 1000 ? 'MAX' : item.amount;

    this._renderAttributes(42, 22, {
        key: 'item',
        separator: '  ',
        parent: this,
        attrs: [{
            key: 'rcv',
            data: { name: 'RECOVER HP', value: value }
        }]
    });
};

module.exports = StoreItemRow;
