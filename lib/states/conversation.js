'use strict';

var MessageScreen = require('../screens/conversation-message/message-screen');
var scripts = require('../../assets/scripts/conversations');
var OverlayState = require('./overlay-state');

function Conversation(game) {
    OverlayState.call(this, game);

    this.game = game;
}

Conversation.prototype = Object.create(OverlayState.prototype);

Conversation.NAME = 'conversation';

Conversation.prototype.init = function(config) {
    this._script = scripts[config.scriptKey];
    this._screens = {};
};

Conversation.prototype.create = function() {
    OverlayState.prototype.create.call(this, this._onMaskClick, this);

    this._renderMessage(this._script[0]);
    this._currentIndex = 0;
    this._scriptIndex = 0;
};

Conversation.prototype._renderMessage = function(message) {
    var game = this.game;
    var screens = this._screens;
    var position = message.position;

    if (screens[position]) {
        screens[position].setMessage(message);
        screens[position].visible = true;
    } else {
        screens[position] = game.stage.addChild(new MessageScreen(game, message));
    }

    if (this._currentScreen) {
        this._currentScreen.setCurrent(false);
    }

    screens[position].setCurrent(true);
    this._currentScreen = screens[position];
};

Conversation.prototype._onMaskClick = function() {
    this._scriptIndex++;
};

Conversation.prototype.update = function() {
    var game = this.game;
    var script = this._script;
    var scriptIndex = this._scriptIndex;
    var message;

    if (this._currentIndex === scriptIndex) {
        return;
    }

    if (scriptIndex >= script.length) {
        game.stateUtil.back();
        return;
    }

    this._currentIndex = scriptIndex;
    message = script[scriptIndex];

    if (message.speaker) {
        this._renderMessage(message);
    } else {
        this._screens[message.position].visible = false;
        this._scriptIndex++;
    }
};

Conversation.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    var screens = this._screens;

    for (var position in screens) {
        screens[position].destroy();
    }

    this._currentScreen = undefined;
};

module.exports = Conversation;
