'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');
var _ = {
    template: require('lodash/string/template')
};

function StoreInfoPanel(game, x, y, store) {
    Panel.call(this, game, x, y, StoreInfoPanel.WIDTH, StoreInfoPanel.HEIGHT);

    this._store = store;

    this._render();
}

StoreInfoPanel.prototype = Object.create(Panel.prototype);

StoreInfoPanel.WIDTH = 428;
StoreInfoPanel.HEIGHT = 54;
StoreInfoPanel.STRINGS = {
    agency: {
        'info': 'Who do you want to hire?',
        'buy': 'Assign the unit to your troop.',
        'buy-info': _.template('Assign "${buyName}" to your troop for ${buy}G.'),
        'buy-replace': _.template('Terminate "${sellName}" for ${sell}G and assign "${buyName}" to your troop for ${buy}G.'),
        'sell': 'Who do you want to terminate?',
        'sell-info': _.template('Terminate "${sellName}" for ${sell}G.')
    },
    item: {
        'info': 'What do you want?',
        'buy': 'Buy this for your troop.',
        'buy-info': _.template('Buy "${buyName}" for ${buy}G.'),
        'buy-replace': _.template('Sell "${sellName}" for ${sell}G and buy "${buyName}" for ${buy}G.'),
        'sell': 'What do you want to sell?',
        'sell-info': _.template('Sell "${sellName}" item for ${sell}G.')
    }
};

StoreInfoPanel.prototype._render = function() {
    var type = this._store.type === 'agency' ? 'agency' : 'item';
    this._infoText = textUtil.renderText(this.game, Panel.X_PADDING, 7, StoreInfoPanel.STRINGS[type].info, {
        type: 'value', scale: 1.25, parent: this, style: {wordWrap: true, wordWrapWidth: 422}
    });
};

StoreInfoPanel.prototype.setText = function(key, config) {
    var type = this._store.type === 'agency' ? 'agency' : 'item';
    var string = StoreInfoPanel.STRINGS[type][key];
    var text = typeof string === 'string' ? string : string(config);

    this._infoText.setText(text);
};

StoreInfoPanel.prototype.setNotEnoughMoneyText = function() {
    this._infoText.setText('You don\'t have enough money for this.');
};

module.exports = StoreInfoPanel;
