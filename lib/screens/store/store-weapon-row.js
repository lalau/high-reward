'use strict';

var StoreRow = require('./store-row');
var weapons = require('../../../configs/weapons');

function StoreWeaponRow(game, x, y, offer) {
    this._weapon = weapons[offer.key];

    StoreRow.call(this, game, x, y, offer);
}

StoreWeaponRow.prototype = Object.create(StoreRow.prototype);

StoreWeaponRow.prototype._renderRowItem = function() {
    this._renderRowItemImage(7, this._weapon.type + '-' + this._offer.key);
};

StoreWeaponRow.prototype._getRowItemName = function() {
    return this._weapon.name;
};

StoreWeaponRow.prototype._getRowItemPrice = function() {
    return this._weapon.price;
};

StoreWeaponRow.prototype._renderRowItemAttributes = function() {
    var weapon = this._weapon;

    this._renderAttributes(42, 18, {
        key: 'weapon',
        pad: 3,
        separator: ':',
        parent: this,
        attrs: [{
            key: 'type',
            data: { name: 'TYPE', value: weapon.typeName.toUpperCase() },
            nextLine: 1,
            pad: 0,
            separator: ' '
        }, {
            key: 'atk',
            data: { name: 'ATTACK', value: weapon.attack },
            nextSpace: 2
        }, {
            key: 'sht',
            data: { name: 'SHOOT SPEED', value: weapon.shoot }
        }]
    });
};

module.exports = StoreWeaponRow;
