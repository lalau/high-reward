'use strict';

var Panel = require('../../components/panel');

function SpeakerPanel(game, x, y, speakerKey) {
    Panel.call(this, game, x, y, SpeakerPanel.WIDTH, SpeakerPanel.HEIGHT);

    this._renderPortrait(Panel.X_PADDING, 3, speakerKey);
}

SpeakerPanel.prototype = Object.create(Panel.prototype);

SpeakerPanel.WIDTH = 140;
SpeakerPanel.HEIGHT = 166;

SpeakerPanel.prototype.setSpeaker = function(speakerKey) {
    this._updatePortrait(speakerKey);
};

module.exports = SpeakerPanel;
