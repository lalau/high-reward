'use strict';

var MessageScreen = require('../screens/conversation-message/message-screen');
var scripts = {
    conversation: require('../../assets/scripts/conversations'),
    hospital: require('../../assets/scripts/hospital'),
    works: require('../../assets/scripts/works')
};
var OverlayState = require('./overlay-state');
var SelectOptions = require('./select-options');
var TextPanel = require('../screens/common/text-panel');
var _ = {
    clone: require('lodash/lang/clone'),
    some: require('lodash/collection/some'),
    mapValues: require('lodash/object/mapValues')
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

    this._scriptConfig = this._script.config || {};
    this._script = this._script.texts || this._script;

    this._speaker = config.speaker || this._scriptConfig.speaker;
    this._position = config.position || this._scriptConfig.position;
    this._speakerMap = config.speakerMap;
    this._data = config.data;
    this._onSelect = config.onSelect;
    this._onOptions = config.onOptions;
    this._onEnd = config.onEnd;
    this._screens = this._screens || {};
};

Conversation.prototype.create = function() {
    OverlayState.prototype.create.call(this, this._onMaskClick, this);
    this.maskAll();

    var message = this._script[0];
    this._scriptIndex = 0;

    if (message.type === 'information') {
        this._handleInformation(message);
    } else {
        this._renderMessage(message);
    }
};

Conversation.prototype._renderMessage = function(message) {
    var game = this.game;
    var screens = this._screens;
    var data = this._evaluateData();
    var position;

    message = this._prepareMessage(message);
    position = message.position;

    if (screens[position]) {
        screens[position].setMessage(message, data);
        screens[position].visible = true;
    } else {
        screens[position] = game.stage.addChild(new MessageScreen(game, message, data));
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

Conversation.prototype._evaluateData = function() {
    var data = this._data;
    var shouldEvaluate = _.some(data, function(value) {
        return typeof value === 'function';
    });

    if (!shouldEvaluate) {
        return data;
    }

    return _.mapValues(data, function(value) {
        if (typeof value === 'function') {
            return value();
        }
        return value;
    });
};

Conversation.prototype._onMaskClick = function() {
    this._scriptIndex++;

    var game = this.game;
    var script = this._script;
    var scriptIndex = this._scriptIndex;
    var message;

    if (this._informationPanel) {
        this._informationPanel.destroy();
        this._informationPanel = undefined;
    }

    if (scriptIndex >= script.length) {
        this._destroy();
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
    } else if (message.type === 'information') {
        this._handleInformation(message);
    } else {
        this._handleMessage(message);
    }
};

Conversation.prototype._handleSelect = function(message) {
    var messageOptions = message.options;
    var onOptions = this._onOptions && this._onOptions[message.key];
    var options;

    if (onOptions) {
        messageOptions = onOptions(messageOptions);
    }

    options = messageOptions.map(function(option) {
        return {
            key: option.text,
            text: option.text,
            enabled: option.enabled,
            callback: this._handleOption.bind(this, message.key, option)
        };
    }, this);

    this.game.state.start(SelectOptions.NAME, undefined, undefined, 'pointer', 'pointer', options);
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
        onSelect: this._onSelect,
        onOptions: this._onOptions,
        onEnd: this._onEnd
    });
};

Conversation.prototype._handleInformation = function(message) {
    var game = this.game;

    this._informationPanel = game.stage.addChild(new TextPanel(game, 'center', 'center', 'auto', 35, message.text, true));
};

Conversation.prototype._handleMessage = function(message) {
    if (message.next) {
        this._script = scripts[this._scriptGroup][message.next];
        this._scriptConfig = this._script.config || {};
        this._script = this._script.texts || this._script;

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

Conversation.prototype._destroy = function() {
    var screens = this._screens;

    for (var position in screens) {
        screens[position].destroy();
    }

    this._screens = undefined;
    this._currentScreen = undefined;
};

Conversation.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);
};

module.exports = Conversation;
