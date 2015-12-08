'use strict';

var Panel = require('../../components/panel');

function PortraitPanel(game, x, y, speakerKey) {
    Panel.call(this, game, x, y, PortraitPanel.WIDTH, PortraitPanel.HEIGHT);

    this._renderPortrait(Panel.X_PADDING, 3, speakerKey);
}

PortraitPanel.prototype = Object.create(Panel.prototype);

PortraitPanel.WIDTH = 140;
PortraitPanel.HEIGHT = 166;

PortraitPanel.prototype.setSpeaker = function(speakerKey) {
    this._updatePortrait(speakerKey);
};

module.exports = PortraitPanel;
