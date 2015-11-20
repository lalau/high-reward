'use strict';

var RegionMap = require('./region-map');
var BattleScreen = require('../screens/battle/battle-screen');
var Information = require('./information');

function Battle(game) {
    this.game = game;
}

Battle.NAME = 'battle';

Battle.prototype.init = function(troop1, troop2) {
    this._troop1 = troop1;
    this._troop2 = troop2;
};

Battle.prototype.create = function() {
    var game = this.game;
    var troop1 = this._troop1;
    var troop2 = this._troop2;
    var screen = new BattleScreen(game, troop1, troop2);

    game.stage.addChild(screen);
    this._screen = screen;

    screen.onBattleEnded.add(function(/*wonTroopIndex*/) {
        game.gameState.bank += 100;
        setTimeout(function() {
            game.state.start(Information.NAME, undefined, undefined, {
                speaker: troop2.commander.key,
                key: 'battle-win-hard',
                config: {
                    amount: 100
                }
            }, function() {
                game.state.start(RegionMap.NAME);
            });
        }, 1000);
    });

    setTimeout(function() {
        screen.start();
    }, 1000);
};

Battle.prototype.shutdown = function() {
    this._screen.destroy();
};

module.exports = Battle;
