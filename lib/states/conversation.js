'use strict';

var MessageScreen = require('../screens/conversation-message/message-screen');
var scripts = {
    conversation: require('../../assets/scripts/conversations'),
    hospital: require('../../assets/scripts/hospital'),
    works: require('../../assets/scripts/works')
};
var OverlayState = require('./overlay-state');
var SelectOptions = require('./select-options');
var _ = {
    clone: require('lodash/lang/clone')
};

function Conversation(game) {
    OverlayState.call(this, game);

    this.game = game;
}

Conversation.prototype = Object.create(OverlayState.prototype);

Conversation.NAME = 'conversation';

Conversation.prototype.init = function(config) {
    this._scriptGroup = config.scriptGroup || 'conversation';
    this._script = scripts[this._scriptGroup][config.scriptKey];
    this._speaker = config.speaker;
    this._position = config.position;
    this._speakerMap = config.speakerMap;
    this._data = config.data;
    this._onSelect = config.onSelect;
    this._onEnd = config.onEnd;
    this._screens = {};
};

Conversation.prototype.create = function() {
    OverlayState.prototype.create.call(this, this._onMaskClick, this);

    this._renderMessage(this._script[0]);
    this._scriptIndex = 0;
};

Conversation.prototype._renderMessage = function(message) {
    var game = this.game;
    var screens = this._screens;
    var position;

    message = this._prepareMessage(message);
    position = message.position;

    if (screens[position]) {
        screens[position].setMessage(message);
        screens[position].visible = true;
    } else {
        screens[position] = game.stage.addChild(new MessageScreen(game, message, this._data));
    }

    if (this._currentScreen) {
        this._currentScreen.setCurrent(false);
    }

    screens[position].setCurrent(true);
    this._currentScreen = screens[position];
};

Conversation.prototype._prepareMessage = function(message) {
    var cloned = false;

    if (!message.speaker && this._speaker) {
        message = cloned ? message : _.clone(message);
        message.speaker = this._speaker;
        cloned = true;
    }

    if (!message.position && this._position) {
        message = cloned ? message : _.clone(message);
        message.position = this._position;
        cloned = true;
    }

    if (this._speakerMap && this._speakerMap[message.speaker]) {
        message = cloned ? message : _.clone(message);
        message.speaker = this._speakerMap[message.speaker];
        cloned = true;
    }

    return message;
};

Conversation.prototype._onMaskClick = function() {
    this._scriptIndex++;

    var game = this.game;
    var script = this._script;
    var scriptIndex = this._scriptIndex;
    var message;

    if (scriptIndex >= script.length) {
        if (this._onEnd) {
            this._onEnd();
        } else {
            game.stateUtil.back();
        }
        return;
    }

    message = script[scriptIndex];

    if (message.type === 'select') {
        this._handleSelect(message);
    } else {
        this._handleMessage(message);
    }
};

Conversation.prototype._handleSelect = function(message) {
    var options = message.options.map(function(option) {
        return {
            key: option.text,
            text: option.text,
            callback: this._handleOption.bind(this, message.key, option)
        };
    }, this);

    this.game.state.start(SelectOptions.NAME, undefined, undefined, options);
};

Conversation.prototype._handleOption = function(key, option) {
    if (this._onSelect && this._onSelect[key]) {
        this._onSelect[key](option.value);
    }

    this.game.state.start(Conversation.NAME, undefined, undefined, {
        scriptGroup: this._scriptGroup,
        scriptKey: option.next,
        speaker: this._speaker,
        position: this._position,
        speakerMap: this._speakerMap,
        data: this._data,
        onEnd: this._onEnd
    });
};

Conversation.prototype._handleMessage = function(message) {
    if (message.next) {
        this._script = scripts[this._scriptGroup][message.next];
        this._scriptIndex = 0;
        message = this._script[0];
    }

    if (message.text) {
        this._renderMessage(message);
    } else {
        this._screens[message.position].visible = false;
        this._onMaskClick();
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
