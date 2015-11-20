'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');

function StoreRow(game, x, y, offer) {
    Panel.call(this, game, x, y, StoreRow.WIDTH, StoreRow.HEIGHT);

    this._offer = offer;

    this._render();
    this._initHoverEffect();
    this._initInput();
}

StoreRow.prototype = Object.create(Panel.prototype);

StoreRow.WIDTH = 284;
StoreRow.HEIGHT = 38;
StoreRow.SELECTED_FILL = '#FF0000';
StoreRow.UNSELECTED_FILL = '#FFFFFF';

StoreRow.prototype._render = function() {
    this._renderRowItem();
    this._renderRowItemTitle();
    this._renderRowItemAttributes();
};

StoreRow.prototype._renderRowItemImage = function(y, imageKey) {
    this.addChild(new Phaser.Image(this.game, Panel.X_PADDING, y, imageKey));
};

StoreRow.prototype._renderRowItemTitle = function() {
    this._typeText = textUtil.renderText(this.game, 42, 5, this._getRowItemName(), { type: 'value', scale: 1.25, parent: this });
    this._separatorText = textUtil.renderText(this.game, 190, 5, ':', { type: 'value', scale: 1.25, parent: this });
    this._priceText = textUtil.renderText(this.game, 266, 5, this._getRowItemPrice(), { type: 'value', scale: 1.25, parent: this, align: 'right' });
};

StoreRow.prototype._initInput = function() {
    var gameState = this.game.gameState;

    this.events.onSelect = new Phaser.Signal();
    this.events.onUnselect = new Phaser.Signal();
    this.events.onSelectNoMoney = new Phaser.Signal();

    this.events.onInputDown.add(function() {
        var price = this._getRowItemPrice();
        var fill;

        if (gameState.bank < price) {
            this.events.onSelectNoMoney.dispatch();
            return;
        }

        if (this._typeText.fill === StoreRow.SELECTED_FILL) {
            fill = StoreRow.UNSELECTED_FILL;
            this.events.onUnselect.dispatch();
        } else {
            fill = StoreRow.SELECTED_FILL;
            this.events.onSelect.dispatch({
                name: this._getRowItemName(),
                offer: this._offer,
                price: price
            }, this);
        }

        this._typeText.fill = fill;
        this._separatorText.fill = fill;
        this._priceText.fill = fill;
    }, this);
};

StoreRow.prototype.unselect = function() {
    this._typeText.fill = StoreRow.UNSELECTED_FILL;
    this._separatorText.fill = StoreRow.UNSELECTED_FILL;
    this._priceText.fill = StoreRow.UNSELECTED_FILL;
    this.events.onUnselect.dispatch();
};

StoreRow.prototype.getOffer = function() {
    return this._offer;
};

module.exports = StoreRow;
