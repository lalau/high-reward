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
    // when coming back from deeper state, no commanderKey is passed, used existing data
    if (commanderKey) {
        this._troop = this.game.gameState.troops[commanderKey];
        this._postings = this._generatePostings();
    }
};

Bulletin.prototype.create = function() {
    var game = this.game;
    var troop = this._troop;
    var wip = this._getTroopWIP();
    var poi;

    OverlayState.prototype.create.call(this, this._onMaskClick, this);

    if (wip) {
        poi = this._getPostingPoi(wip);
        game.state.start(Conversation.NAME, undefined, undefined, {
            scriptKey: 'work-in-progress',
            speaker: {
                name: troop.commander.name,
                portrait: troop.commander.key
            },
            data: {
                name: poi.name
            },
            onEnd: function() {
                game.state.start(StationMenu.NAME);
            }
        });
    } else if (this._screen) {
        this._screen.showPanels();
    } else {
        this._screen = game.stage.addChild(new BulletinScreen(game, troop, this._postings));
        this._initPostingSelect();
    }
};

Bulletin.prototype._getTroopWIP = function() {
    var commanderKey = this._troop.commander.key;
    var wip;

    this.game.gameState.works.some(function(work) {
        if (work.commanderKey === commanderKey) {
            wip = work;
            return true;
        }
    }, this);

    return wip;
};

Bulletin.prototype.update = function() {
    var flashCount = 2;

    if (!this._pointer) {
        // setup to flash X time when pointer is rendered next time
        this._flashPointerCount = flashCount;
    } else if (this._pointer && this._flashPointerCount > 0) {
        if (this._flashPointerCount === flashCount && !this._lastPointerUpdateTime) {
            // init the last update time after rendering the pointer
            this._lastPointerUpdateTime = Date.now();
        }

        if (this._lastPointerUpdateTime + 500 < Date.now()) {
            if (this._pointer.visible) {
                this._pointer.visible = false;
                this._lastPointerUpdateTime = Date.now();
            } else {
                this._flashPointerCount--;
                this._pointer.visible = true;
                if (this._flashPointerCount === 0) {
                    // reset the last update time after finishing flashing
                    this._lastPointerUpdateTime = undefined;
                    this._startWorkConversation();
                } else {
                    this._lastPointerUpdateTime = Date.now();
                }
            }
        }
    }
};

Bulletin.prototype._generatePostings = function() {
    var currentDate = this.game.gameState.worldTime.date();
    var postingCount = Math.ceil(Math.random() * 4);
    var postings = [];
    var posting;
    var client;

    while (postingCount--) {
        client = npc[_.sample(works.clients).key];
        posting = {
            name: client.name,
            portrait: Array.isArray(client.portrait) ? _.sample(client.portrait) : client.portrait,
            work: Array.isArray(client.workScript) ? _.sample(client.workScript) : client.workScript,
            item: _.sample(works.delivery).item,
            country: 'zelerd',
            destination: _.sample(Region.Pois['zelerd']).key,
            days: Math.ceil(Math.random() * 3),
            amount: Math.ceil(Math.random() * 1500),
            updatedDate: currentDate
        };

        posting.reward = posting.work === 'work-6' ? (posting.amount * 2) : posting.amount;
        posting.penalty = Math.floor(Math.random() * posting.reward);

        while (posting.destination === this._troop.poi) {
            posting.destination = _.sample(Region.Pois['zelerd']).key;
        }

        postings.push(posting);
    }

    return postings;
};

Bulletin.prototype._initPostingSelect = function() {
    this._screen.events.onSelect.add(function(posting) {
        this._selectedPosting = posting;
        this._screen.hidePanels();
        this._renderPointer(posting);
    }, this);
};

Bulletin.prototype._startWorkConversation = function() {
    var self = this;
    var game = this.game;
    var commanderKey = this._troop.commander.key;
    var posting = this._selectedPosting;
    var postingPoi = this._getPostingPoi(posting);
    var accepted;

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
            name: postingPoi.name,
            amount: posting.amount,
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
            self._destroyPointer();
            self._selectedPosting = undefined;
            if (accepted) {
                self._destroyScreen();
                game.state.start(StationMenu.NAME);
            } else {
                game.stateUtil.back();
            }
        }
    });
};

Bulletin.prototype._getPostingPoi = function(posting) {
    return Region.Pois[posting.country][posting.destination];
};

Bulletin.prototype._renderPointer = function(posting) {
    var postingPoi = this._getPostingPoi(posting);
    this._pointer = this._screen.addChild(new Phaser.Image(this.game, postingPoi.x + 10, postingPoi.y - 40, 'pointer'));
};

Bulletin.prototype._destroyPointer = function() {
    if (this._pointer) {
        this._pointer.destroy();
        this._pointer = undefined;
    }
};

Bulletin.prototype._destroyScreen = function() {
    if (this._screen) {
        this._screen.destroy();
        this._screen = undefined;
    }
};

Bulletin.prototype._onMaskClick = function() {
    if (!this._pointer) {
        this._destroyScreen();
        this.game.stateUtil.back();
    }
};

Bulletin.prototype.shutdown = function() {
    OverlayState.prototype.shutdown.call(this);
};

module.exports = Bulletin;
