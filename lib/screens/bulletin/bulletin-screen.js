'use strict';

var PortraitPanel = require('../common/portrait-panel');
var TextPanel = require('../common/text-panel');
var PostingPanel = require('./posting-panel');

function BulletinScreen(game, troop, postings) {
    Phaser.Group.call(this, game, null, 'bulletin-screen');

    this._troop = troop;
    this._panels = {
        portraitPanel: this.addChild(new PortraitPanel(this.game, 'center', 33, troop.commander.key)),
        textPanel: this.addChild(new TextPanel(this.game, 'center', 201, 'auto', 24, 'Work Posting')),
        postingPanel: this.addChild(new PostingPanel(this.game, 'center', 240, postings))
    };

    this.events = {
        onSelect: this._panels.postingPanel.events.onSelect
    };
}

BulletinScreen.prototype = Object.create(Phaser.Group.prototype);

module.exports = BulletinScreen;
