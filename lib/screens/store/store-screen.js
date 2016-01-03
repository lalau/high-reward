'use strict';

var Panel = require('../../components/panel');
var StoreTitlePanel = require('./store-title-panel');
var StoreOwnerPanel = require('./store-owner-panel');
var StoreSellPanel = require('./store-sell-panel');
var StoreInfoPanel = require('./store-info-panel');
var StoreTroopPanel = require('./store-troop-panel');
var Unit = require('../../models/unit');
var Rows = {
    agency: require('./store-unit-row'),
    weapon: require('./store-weapon-row'),
    protection: require('./store-protection-row'),
    item: require('./store-item-row')
};

function StoreScreen(game, troop, store) {
    Phaser.Group.call(this, game, null, 'store-screen');

    this._troop = troop;
    this._store = store;

    this._panels = {
        storeTitle: this.addChild(new StoreTitlePanel(game, 58, 65, store)),
        storeOwner: this.addChild(new StoreOwnerPanel(game, 58, 97, store)),
        storeRows: this._initStoreRows(),
        storeSell: this.addChild(new StoreSellPanel(game, 202, 257, store)),
        storeInfo: this.addChild(new StoreInfoPanel(game, 58, 281, store)),
        storeTroop: this.addChild(new StoreTroopPanel(game, 490, 65, troop, store))
    };

    this._initSellInput();
}

StoreScreen.prototype = Object.create(Phaser.Group.prototype);

StoreScreen.prototype._initStoreRows = function() {
    var store = this._store;
    var rowX = 202;
    var rowY = 97;
    var rows = [];
    var rowCount;
    var offer;
    var row;

    for (rowCount = 0; rowCount < 4; rowCount++) {
        offer = store.offers[rowCount];
        if (offer) {
            row = this.addChild(new Rows[store.type](this.game, rowX, rowY, offer));
            this._handleSelectRow(row);
        } else {
            row = this.addChild(new Panel(this.game, rowX, rowY, 284, 38));
        }
        rows[rowCount] = row;
        rowY += 40;
    }

    return rows;
};

StoreScreen.prototype._shouldEnableUnitInput = function(transaction, offer, unitSlot) {
    var storeType = this._store.type;
    var unit = unitSlot.getUnit();

    if (storeType === 'agency') {
        if (transaction === 'buy') {
            return true;
        } else {
            return !!unit;
        }
    }

    if (!unit) {
        return false;
    }

    if (transaction === 'buy') {
        return !!unit.canHandle(storeType, offer.key);
    } else {
        return !!unit[storeType];
    }
};

StoreScreen.prototype._handleSelectRow = function(row) {
    var storeType = this._store.type;

    row.events.onSelect.add(function(selectedOffer) {
        var panels = this._panels;
        var storeTroopPanel = panels.storeTroop;

        panels.storeRows.forEach(function(storeRow) {
            if (storeRow.unselect && selectedOffer.offer !== storeRow.getOffer()) {
                storeRow.unselect();
            }
        });
        panels.storeSell.unselect();
        panels.storeInfo.setText('buy');
        storeTroopPanel.enableInput(this._shouldEnableUnitInput.bind(this, 'buy', selectedOffer.offer));
        if (storeType !== 'agency') {
            storeTroopPanel.enableSubSlot(storeType);
        } else {
            storeTroopPanel.disableSubSlot();
        }
        this._initTroopInput();
        this._selectedOffer = selectedOffer;
        this._sell = false;
    }, this);

    row.events.onUnselect.add(function() {
        var panels = this._panels;

        panels.storeInfo.setText('info');
        panels.storeTroop.disableInput();
        this._selectedOffer = undefined;
        this._sell = false;
    }, this);

    row.events.onSelectNoMoney.add(this._handleSelectNoMoney, this);
};

StoreScreen.prototype._handleSelectNoMoney = function() {
    var panels = this._panels;

    panels.storeRows.forEach(function(storeRow) {
        if (storeRow.unselect) {
            storeRow.unselect();
        }
    });
    panels.storeSell.unselect();
    panels.storeInfo.setNotEnoughMoneyText();
};

StoreScreen.prototype._initSellInput = function() {
    var panels = this._panels;
    var panel = panels.storeSell;

    panel.events.onSelect.add(function() {
        panels.storeRows.forEach(function(row) {
            if (row.unselect) {
                row.unselect();
            }
        });
        panels.storeInfo.setText('sell');
        panels.storeTroop.enableInput(this._shouldEnableUnitInput.bind(this, 'sell', undefined));
        this._initTroopInput();
        this._selectedOffer = undefined;
        this._sell = true;
    }, this);

    panel.events.onUnselect.add(function() {
        panels.storeInfo.setText('info');
        panels.storeTroop.disableInput();
        this._selectedOffer = undefined;
        this._sell = false;
    }, this);
};

StoreScreen.prototype._initTroopInput = function() {
    if (this._setupTroopInput) {
        return;
    }

    var panels = this._panels;
    var storeTroopPanel = panels.storeTroop;
    var storeInfoPanel = panels.storeInfo;

    storeTroopPanel.events.onUnitSlotOver.add(function(unitSlot) {
        var unit = unitSlot.getUnit();
        var selectedOffer = this._selectedOffer;
        var sellCurrent = this._getSellCurrent(unit);
        var sellName = sellCurrent.name;
        var sellPrice = sellCurrent.price;
        var storeType = this._store.type;

        if (selectedOffer) {
            if (storeType === 'item') {
                if (!sellPrice || selectedOffer.offer.key === unit.items[0].key) {
                    if (unit.items.length >= 5) {
                        storeInfoPanel.setText('buy-no-more', {buyName: selectedOffer.name});
                    } else {
                        storeInfoPanel.setText('buy-info', {buy: selectedOffer.price, buyName: selectedOffer.name});
                    }
                } else {
                    storeInfoPanel.setText('buy-replace', {
                        sell: sellPrice,
                        sellName: sellName,
                        buy: selectedOffer.price,
                        buyName: selectedOffer.name
                    });
                }
            } else {
                if (sellPrice) {
                    storeInfoPanel.setText('buy-replace', {
                        sell: sellPrice,
                        sellName: sellName,
                        buy: selectedOffer.price,
                        buyName: selectedOffer.name
                    });
                } else {
                    storeInfoPanel.setText('buy-info', {buy: selectedOffer.price, buyName: selectedOffer.name});
                }
            }
        } else {
            if (sellPrice) {
                storeInfoPanel.setText('sell-info', {sell: sellPrice, sellName: sellName});
            }
        }
    }, this);

    storeTroopPanel.events.onUnitSlotOut.add(function() {
        if (this._selectedOffer) {
            storeInfoPanel.setText('buy');
        } else {
            storeInfoPanel.setText('sell');
        }
    }, this);

    storeTroopPanel.events.onUnitSlotDown.add(function(unitSlot) {
        var memberIndex = unitSlot.getMemberIndex();
        var unit = unitSlot.getUnit();
        var storeType = this._store.type;
        var selectedOffer = this._selectedOffer;

        if (storeType === 'item' && unit.items.length >= 5 && selectedOffer.offer.key === unit.items[0].key) {
            return;
        }

        this._executeOffer(memberIndex);
        storeTroopPanel.updateMembers(memberIndex);
        if (this._sell) {
            storeTroopPanel.enableInput(this._shouldEnableUnitInput.bind(this, 'sell', undefined));
        }
        panels.storeTitle.update();
    }, this);

    storeTroopPanel.events.onUnitSlotToggle.add(function(toggledType) {
        if (this._store.type !== toggledType) {
            panels.storeRows.forEach(function(storeRow) {
                if (storeRow.unselect) {
                    storeRow.unselect();
                }
            });
            panels.storeSell.unselect();
        }
    }, this);

    this._setupTroopInput = true;
};

StoreScreen.prototype._executeOffer = function(memberIndex) {
    var storeType = this._store.type;
    var selectedOffer = this._selectedOffer;
    var troop = this._troop;
    var troopUnit = troop.getUnitAt(memberIndex);

    this._updateBank(memberIndex);
    this._updateSelectedOffer();

    if (storeType === 'agency') {
        if (selectedOffer) {
            troop.replaceMember(memberIndex, new Unit(selectedOffer.offer));
        } else if (troopUnit) {
            troop.removeMember(memberIndex);
        }
    } else {
        troopUnit.updateItem(storeType, selectedOffer && selectedOffer.offer && selectedOffer.offer.key);
    }
};

StoreScreen.prototype._updateBank = function(memberIndex) {
    var selectedOffer = this._selectedOffer;
    var gameState = this.game.gameState;
    var troopUnit = this._troop.getUnitAt(memberIndex);

    if (selectedOffer) {
        gameState.bank -= selectedOffer.price;
    }
    gameState.bank += this._getSellCurrent(troopUnit).price || 0;
};

StoreScreen.prototype._updateSelectedOffer = function() {
    var selectedOffer = this._selectedOffer;
    var gameState = this.game.gameState;

    this._panels.storeRows.forEach(function(storeRow) {
        if (selectedOffer && storeRow.getOffer && selectedOffer.offer === storeRow.getOffer()) {
            if (gameState.bank < selectedOffer.price) {
                this._handleSelectNoMoney();
            }
        }
    }, this);
};

StoreScreen.prototype._getSellCurrent = function(unit) {
    var storeType = this._store.type;
    var sellPrice;
    var sellName;

    if (!unit) {
        return {};
    }

    if (storeType === 'agency') {
        sellPrice = unit.getSellPrice();
        sellName = unit.name;
    } else if (storeType === 'weapon') {
        sellPrice = unit.getWeaponSellPrice();
        sellName = unit.weapon && unit.weapon.name;
    } else if (storeType === 'protection') {
        sellPrice = unit.getProtectionSellPrice();
        sellName = unit.protection && unit.protection.name;
    } else if (storeType === 'item') {
        sellPrice = unit.getItemSellPrice();
        sellName = unit.items[0] && unit.items[0].name;
    }

    return {
        name: sellName,
        price: sellPrice
    };
};

module.exports = StoreScreen;
