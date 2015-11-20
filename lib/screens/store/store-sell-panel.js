'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');

function StoreSellPanel(game, x, y, store) {
    Panel.call(this, game, x, y, StoreSellPanel.WIDTH, StoreSellPanel.HEIGHT);

    this._store = store;

    this._render();
    this._initHoverEffect();
    this._initInput();
}

StoreSellPanel.prototype = Object.create(Panel.prototype);

StoreSellPanel.WIDTH = 284;
StoreSellPanel.HEIGHT = 22;
StoreSellPanel.SELECTED_FILL = '#FF0000';
StoreSellPanel.UNSELECTED_FILL = '#FFFFFF';
StoreSellPanel.STRINGS = {
    agency: 'Terminate Member',
    item: ' Sell Item '
};

StoreSellPanel.prototype._render = function() {
    var type = this._store.type;
    var string = StoreSellPanel.STRINGS[type] || StoreSellPanel.STRINGS.item;

    this._text = textUtil.renderText(this.game, StoreSellPanel.WIDTH / 2, 6, string, { type: 'value', scale: 1.25, parent: this, align: 'center' });
};

StoreSellPanel.prototype._initInput = function() {
    this.events.onSelect = new Phaser.Signal();
    this.events.onUnselect = new Phaser.Signal();

    this.events.onInputDown.add(function() {
        if (this._text.fill === StoreSellPanel.SELECTED_FILL) {
            this._text.fill = StoreSellPanel.UNSELECTED_FILL;
            this.events.onUnselect.dispatch();
        } else {
            this._text.fill = StoreSellPanel.SELECTED_FILL;
            this.events.onSelect.dispatch();
        }
    }, this);
};

StoreSellPanel.prototype.unselect = function() {
    this._text.fill = StoreSellPanel.UNSELECTED_FILL;
    this.events.onUnselect.dispatch();
};

module.exports = StoreSellPanel;
