'use strict';

var BulletinScreen = require('../screens/bulletin/bulletin-screen');
var OverlayState = require('./overlay-state');
var Conversation = require('./conversation');
var StationMenu = require('./station-menu');
var Region = require('../components/region');
var npc = require('../../configs/npc');
var works = require('../../configs/works');
var _ = {
    sample: require('lodash/collection/sample')
};

function Bulletin(game) {
    OverlayState.call(this, game);

    this.game = game;
}

Bulletin.prototype = Object.create(OverlayState.prototype);

Bulletin.NAME = 'bulletin';

Bulletin.prototype.init = function(commanderKey) {
    this._troop = commanderKey ? this.game.gameState.troops[commanderKey] : this._troop;
};

Bulletin.prototype.create = function() {
    var game = this.game;

    OverlayState.prototype.create.call(this);

    this._screen = game.stage.addChild(new BulletinScreen(game, this._troop, this._generatePostings()));

    this._initPostingSelect();
};

Bulletin.prototype._generatePostings = function() {
    var postingCount = Math.ceil(Math.random() * 4);
    var postings = [];
    var client;

    while (postingCount--) {
        client = npc[_.sample(works.clients).key];

        postings.push({
            name: client.name,
            portrait: Array.isArray(client.portrait) ? _.sample(client.portrait) : client.portrait,
            work: Array.isArray(client.workScript) ? _.sample(client.workScript) : client.workScript,
            item: _.sample(works.delivery).item,
            country: 'zelerd',
            destination: _.sample(Region.Pois['zelerd']).key,
            days: Math.ceil(Math.random() * 3),
            reward: Math.ceil(Math.random() * 1500)
        });
    }

    return postings;
};

Bulletin.prototype._initPostingSelect = function() {
    var game = this.game;
    var commanderKey = this._troop.commander.key;
    var accepted;

    this._screen.events.onSelect.add(function(posting) {
        game.state.start(Conversation.NAME, undefined, undefined, {
            scriptGroup: 'works',
            scriptKey: posting.work,
            speaker: {
                name: posting.name,
                portrait: posting.portrait
            },
            position: 'top',
            data: {
                item: posting.item,
                name: Region.Pois[posting.country][posting.destination].name,
                amount: posting.reward + 'G',
                days: posting.days + ' day' + (posting.days > 1 ? 's' : '')
            },
            onSelect: {
                accept: function(doAccept) {
                    if (doAccept) {
                        posting.commanderKey = commanderKey;
                        game.gameState.works.push(posting);
                        accepted = true;
                    }
                }
            },
            onEnd: function() {
                if (accepted) {
                    game.state.start(StationMenu.NAME);
                } else {
                    game.state.start(Bulletin.NAME, undefined, undefined, commanderKey);
                }
            }
        });
    }, this);
};

Bulletin.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);

    this._screen.destroy();
};

module.exports = Bulletin;
