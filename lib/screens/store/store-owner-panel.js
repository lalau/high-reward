'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');

function StoreOwnerPanel(game, x, y, store) {
    Panel.call(this, game, x, y, StoreOwnerPanel.WIDTH, StoreOwnerPanel.HEIGHT);

    this._store = store;

    this._render();
}

StoreOwnerPanel.prototype = Object.create(Panel.prototype);

StoreOwnerPanel.WIDTH = 140;
StoreOwnerPanel.HEIGHT = 182;

StoreOwnerPanel.prototype._render = function() {
    this._renderTitle();
    this._renderOwner();
};

StoreOwnerPanel.prototype._renderTitle = function() {
    textUtil.renderText(this.game, Panel.X_PADDING, 5, 'SHOP OWNER', { parent: this });
};

StoreOwnerPanel.prototype._renderOwner = function() {
    this._renderPortrait(Panel.X_PADDING, 15, this._store.ownerKey || (this._store.type + '-owner'));
};

module.exports = StoreOwnerPanel;
