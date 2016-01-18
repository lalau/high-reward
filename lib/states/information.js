'use strict';

var InformationScreen = require('../screens/conversation-message/information-screen');
var OverlayState = require('./overlay-state');
var infoUtil = require('../utils/info-util');

function Information(game) {
    OverlayState.call(this, game);

    this.game = game;
}

Information.prototype = Object.create(OverlayState.prototype);

Information.prototype.init = function(information, done) {
    this._information = information;
    this._done = done;
};

Information.prototype.create = function() {
    OverlayState.prototype.create.call(this, this._onMaskClick, this);
    this.maskAll();

    this._renderInformation();
};

Information.prototype._renderInformation = function() {
    var game = this.game;
    var information = this._information;

    this._screen = this.game.stage.addChild(new InformationScreen(game, {
        speaker: information.speaker,
        text: infoUtil.getMessage(information.key, information.config)
    }));
};

Information.prototype._onMaskClick = function() {
    if (this._done) {
        this._done();
    } else {
        this.game.stateUtil.back();
    }
};

Information.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._screen.destroy();
    this._screen = undefined;
};

module.exports = Information;
