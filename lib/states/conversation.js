'use strict';

var MessageScreen = require('../screens/conversation-message/message-screen');
var scripts = require('../../assets/scripts/conversations');
var key = 'introduction';

function Conversation(game) {
    this.game = game;
}

Conversation.NAME = 'conversation';

Conversation.prototype.init = function(config) {
    this._script = scripts[config.scriptKey || key];
    this._screens = {};
    this._done = config.done;
};

Conversation.prototype.create = function() {
    this._renderMessage(this._script[0]);
    this._renderClickMask();
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

Conversation.prototype._renderClickMask = function() {
    var game = this.game;
    var clickMask = game.stage.addChild(new Phaser.Graphics(game, 0, 0));

    clickMask.drawRect(0, 0, game.width, game.height);
    clickMask.inputEnabled = true;
    clickMask.input.priorityID = 1;
    clickMask.hitArea = new Phaser.Polygon([
        { x: 0, y: 0 },
        { x: 0, y: game.height },
        { x: game.width, y: game.height },
        { x: game.width, y: 0 }
    ]);
    clickMask.events.onInputDown.add(function() {
        this._scriptIndex++;
    }, this);

    this._clickMask = clickMask;
};

Conversation.prototype.update = function() {
    var script = this._script;
    var scriptIndex = this._scriptIndex;
    var message;

    if (this._currentIndex === scriptIndex) {
        return;
    }

    if (scriptIndex >= script.length) {
        this._done();
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
    var screens = this._screens;

    for (var position in screens) {
        screens[position].destroy();
    }

    this._clickMask.destroy();
    this._clickMask = undefined;
    this._currentScreen = undefined;
};

module.exports = Conversation;
