'use strict';

var moment = require('moment');
var Conversation = require('./conversation');
var RegionMap = require('./region-map');

function Collector(game) {
    this.game = game;
}

Collector.NAME = 'collector';

Collector.INTRODUCE_DATE = moment('0632-04-21 00', 'YYYY-MM-DD HH');

Collector.prototype.init = function(action) {
    this._action = action;
};

Collector.prototype.create = function() {
    var action = this._action;

    if (action === 'introduce') {
        this._introduce();
    } else if (action === 'collect') {
        this._collect();
    }
};

Collector.prototype._introduce = function() {
    var game = this.game;
    var gameState = game.gameState;

    game.state.start(Conversation.NAME, undefined, undefined, {
        scriptKey: 'collector-introduction',
        onEnd: function() {
            gameState.nextCollectDate = Collector.INTRODUCE_DATE.clone();
            gameState.nextCollectDate.add(7, 'd');
            game.state.start(RegionMap.NAME);
        }
    });

    gameState.collectorIntroduced = true;
};

Collector.prototype._collect = function() {
    var game = this.game;
    var gameState = game.gameState;
    var amount;

    game.state.start(Conversation.NAME, undefined, undefined, {
        scriptKey: 'collector-collect',
        data: {
            amount: function() {
                return amount;
            },
            remaining: function() {
                return gameState.debt - amount;
            }
        },
        onSelect: {
            amount: function(selectAmount) {
                amount = selectAmount;
            }
        },
        onOptions: {
            amount: function(options) {
                var canAfford = gameState.bank >= 5000;

                return options.filter(function(option) {
                    if (option.key) {
                        if (option.key === 'pay-5000' && !canAfford) {
                            return false;
                        } else if (option.key === 'pay-unable' && canAfford) {
                            return false;
                        }
                    }
                    return true;
                });
            }
        },
        onEnd: function() {
            if (amount > 0) {
                gameState.bank -= amount;
            }
            gameState.debt -= amount;
            gameState.nextCollectDate.add(7, 'd');
            game.state.start(RegionMap.NAME);
        }
    });
};

module.exports = Collector;
