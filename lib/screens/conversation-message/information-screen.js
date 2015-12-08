'use strict';

var PortraitPanel = require('../common/portrait-panel');
var MessagePanel = require('./message-panel');
var commanders = require('../../../configs/commanders');

function InformationScreen(game, information) {
    Phaser.Group.call(this, game);

    this.x = 178;
    this.y = 125;

    this._information = information;

    this._render();
}

InformationScreen.prototype = Object.create(Phaser.Group.prototype);

InformationScreen.WIDTH = 268;
InformationScreen.HEIGHT = 258;

InformationScreen.prototype._render = function() {
    var information = this._information;
    var speaker = information.speaker;

    this._portraitPanel = this.addChild(new PortraitPanel(this.game, 72, 0, speaker));
    this._messagePanel = this.addChild(new MessagePanel(this.game, 0, 172, commanders[speaker].troopName + '\n' + information.text));
};

module.exports = InformationScreen;
