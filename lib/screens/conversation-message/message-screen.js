'use strict';

var textUtil = require('../../utils/text-util');
var SpeakerPanel = require('./speaker-panel');
var MessagePanel = require('./message-panel');
var commanders = require('../../../configs/commanders');

function MessageScreen(game, message) {
    Phaser.Group.call(this, game);

    var messagePosition = MessageScreen.POSITION[message.position];

    this.x = messagePosition.x;
    this.y = messagePosition.y;

    this._message = message;
    this._isCurrent = true;

    this._render();
}

MessageScreen.prototype = Object.create(Phaser.Group.prototype);

MessageScreen.WIDTH = 428;
MessageScreen.HEIGHT = 166;
MessageScreen.POSITION = {
    top: { x: 18, y: 11 },
    bottom: { x: 194, y: 201 },
    center: { x: 106, y: 89 }
};

MessageScreen.prototype._render = function() {
    var message = this._message;

    this._speakerPanel = this.addChild(new SpeakerPanel(this.game, 0, 0, message.speaker));
    this._messagePanel = this.addChild(new MessagePanel(this.game, 160, 96, message.text));
    this._speakerNameText = textUtil.renderText(this.game, 174, 3, this._getSpeakerName(message), {
        type: 'value', scale: 2, parent: this
    });
};

MessageScreen.prototype._getSpeakerName = function(message) {
    return commanders[message.speaker].fullName;
};

MessageScreen.prototype.setCurrent = function(isCurrent) {
    if (this._isCurrent !== isCurrent) {
        this._isCurrent = isCurrent;
        this._messagePanel.setFlasher(isCurrent);
    }
};

MessageScreen.prototype.setMessage = function(message) {
    var currentMessage = this._message;

    if (message.speaker !== currentMessage.speaker) {
        this._speakerPanel.setSpeaker(message.speaker);
        this._speakerNameText.setText(this._getSpeakerName(message));
    }

    if (message.text !== currentMessage.text) {
        this._messagePanel.setMessage(message.text);
    }

    this._message = message;
};

module.exports = MessageScreen;
