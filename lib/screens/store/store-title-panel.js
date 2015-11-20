'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');

function StoreTitlePanel(game, x, y, store) {
    Panel.call(this, game, x, y, StoreTitlePanel.WIDTH, StoreTitlePanel.HEIGHT);

    this._store = store;

    this._render();
}

StoreTitlePanel.prototype = Object.create(Panel.prototype);

StoreTitlePanel.WIDTH = 428;
StoreTitlePanel.HEIGHT = 30;

StoreTitlePanel.prototype._render = function() {
    this._renderName();
    this._renderBank();
};

StoreTitlePanel.prototype._renderName = function() {
    textUtil.renderText(this.game, Panel.X_PADDING, 10, this._store.name.toUpperCase(), { type: 'value', scale: 1.25, parent: this });
};

StoreTitlePanel.prototype._renderBank = function() {
    var game = this.game;

    textUtil.renderText(game, 246, 10, 'BANK:', { type: 'value', scale: 1.25, parent: this });
    textUtil.renderText(game, 397, 10, 'G', { type: 'value', align: 'right', scale: 1.25, parent: this });
    this._bankText = textUtil.renderText(game, 374, 10, game.gameState.bank, { type: 'value', scale: 1.25, align: 'right', parent: this });
};

StoreTitlePanel.prototype.update = function() {
    var bankAmount = this.game.gameState.bank;

    if (bankAmount != this._bankText.text) {
        this._bankText.setText(bankAmount);
    }
};

module.exports = StoreTitlePanel;
