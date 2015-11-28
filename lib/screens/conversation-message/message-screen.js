'use strict';

var textUtil = require('../../utils/text-util');
var SpeakerPanel = require('./speaker-panel');
var MessagePanel = require('./message-panel');
var commanders = require('../../../configs/commanders');
var speakers = require('../../../configs/speakers');
var _ = {
    forEach: require('lodash/collection/forEach'),
    template: require('lodash/string/template')
};

function MessageScreen(game, message, messageData) {
    Phaser.Group.call(this, game);

    var messagePosition = MessageScreen.POSITION[message.position];

    this.x = messagePosition.x;
    this.y = messagePosition.y;

    this._message = message;
    this._messageData = messageData;
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
    this._messagePanel = this.addChild(new MessagePanel(this.game, 160, 96, this._getMessageText(message)));
    this._speakerNameText = textUtil.renderText(this.game, 174, 3, this._getSpeakerName(), {
        type: 'value', scale: 1.5, parent: this
    });
};

MessageScreen.prototype._getSpeakerName = function() {
    var speakerKey = this._message.speaker;
    var speaker = commanders[speakerKey] || speakers[speakerKey];

    if (typeof speaker.fullName === 'string' && speaker.fullName.indexOf('${') >= 0) {
        speaker.fullName = _.template(speaker.fullName);
    }

    if (typeof speaker.fullName === 'function') {
        return speaker.fullName(this._messageData);
    } else {
        return speaker.fullName;
    }
};

MessageScreen.prototype._getMessageText = function(message) {
    if (typeof message.text === 'string' && message.text.indexOf('${') >= 0) {
        message.text = _.template(message.text);
    }

    if (typeof message.text === 'function') {
        return message.text(this._messageData);
    } else {
        return message.text;
    }
};

MessageScreen.prototype.setCurrent = function(isCurrent) {
    if (this._isCurrent !== isCurrent) {
        this._isCurrent = isCurrent;
        this._messagePanel.setFlasher(isCurrent);
    }
};

MessageScreen.prototype.setMessage = function(message) {
    var currentMessage = this._message;

    this._message = message;

    if (message.speaker !== currentMessage.speaker) {
        this._speakerPanel.setSpeaker(message.speaker);
        this._speakerNameText.setText(this._getSpeakerName());
    }

    if (this._getMessageText(message) !== this._getMessageText(currentMessage)) {
        this._messagePanel.setMessage(this._getMessageText(message));
    }

    this._message = message;
};

module.exports = MessageScreen;
