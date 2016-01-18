'use strict';

var units = require('../../configs/units');
var weapons = require('../../configs/weapons');
var protections = require('../../configs/protections');
var items = require('../../configs/items');
var _ = {
    assign: require('lodash/object/assign'),
    clone: require('lodash/lang/clone')
};

function Unit(config) {
    var unitConfig = _.assign({}, units[config.key], config.unitConfig);

    this.key = unitConfig.key;
    this.name = unitConfig.name;
    this.type = 'unit';

    if (config.attrs) {
        this.attrs = config.attrs;
    } else {
        this.attrs = _.clone(unitConfig.attributes);
        if (config.preset) {
            _.assign(this.attrs, unitConfig.presets[config.preset].attributes);
        }
        this.attrs.maxHp = this.attrs.hp;
        this.attrs.fatigue = 0;
    }

    if (unitConfig.weapon) {
        this.weapon = weapons[unitConfig.weapon];
    }
    if (unitConfig.protection) {
        this.protection = protections[unitConfig.protection];
    }
    if (unitConfig.items) {
        this.items = unitConfig.items.map(function(item) {
            return items[item];
        });
    } else {
        this.items = [];
    }
}

Unit.rehydrate = function(driedUnit) {
    return new Unit(driedUnit);
};

Unit.prototype.dehydrate = function() {
    return {
        unitConfig: {
            key: this.key,
            name: this.name,
            weapon: this.weapon && this.weapon.key,
            protection: this.protection && this.protection.key,
            items: this.items && this.items.map(function(item) {
                return item.key;
            })
        },
        attrs: this.attrs
    };
};

Unit.prototype.getAssetKey = function() {
    return this.key;
};

Unit.prototype.getPay = function() {
    return Math.floor(this.getPrice() / 5);
};

Unit.prototype.getPrice = function() {
    var attrs = this.attrs;

    return Math.floor(200 * ((attrs.maxHp / 16) * (attrs.shoot / 8) * (attrs.defence / 8)));
};

Unit.prototype.getSellPrice = function() {
    return Math.floor(this.getPrice() / 2) + this.getWeaponSellPrice() + this.getProtectionSellPrice() + this.getItemSellPrice();
};

Unit.prototype.getWeaponSellPrice = function() {
    return Math.floor(this.weapon ? this.weapon.price / 2 : 0);
};

Unit.prototype.getProtectionSellPrice = function() {
    return Math.floor(this.protection ? this.protection.price / 2 : 0);
};

Unit.prototype.getItemSellPrice = function() {
    var price = 0;

    this.items.forEach(function(item) {
        price += Math.floor(item.price / 2);
    });

    return price;
};

Unit.prototype.getTypeConfig = function() {
    return units[this.key];
};

Unit.prototype.updateItem = function(itemType, itemKey) {
    if (itemType === 'weapon') {
        this.weapon = itemKey ? weapons[itemKey] : undefined;
    } else if (itemType === 'protection') {
        this.protection = itemKey ? protections[itemKey] : undefined;
    } else if (itemType === 'item') {
        if (!itemKey) {
            this.items = [];
        } else {
            if (this.items.length === 0 || this.items[0].key === itemKey) {
                this.items.push(items[itemKey]);
            } else {
                this.items = [items[itemKey]];
            }
        }
    }
};

Unit.prototype.canHandle = function(itemType, itemKey) {
    if (!itemKey) {
        return;
    }

    if (itemType === 'weapon') {
        return this.getTypeConfig().weaponTypes.indexOf(weapons[itemKey].type) >= 0;
    } else if (itemType === 'protection') {
        return this.getTypeConfig().protectionTypes.indexOf(protections[itemKey].type) >= 0;
    } else if (itemType === 'item') {
        return true;
    }
};

module.exports = Unit;
