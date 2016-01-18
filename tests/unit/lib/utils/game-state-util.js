'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var gameStateUtil;

function MockRegion(game, name) {
    this.name = name;
}
MockRegion.prototype.getName = function() {
    return this.name;
};

describe('Game State Util', function () {
    before(function() {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false,
            warnOnReplace: false
        });
        mockery.registerMock('../components/region', MockRegion);
        gameStateUtil = require('../../../../lib/utils/game-state-util');
    });

    after(function() {
        mockery.disable();
        mockery.deregisterAll();
    });

    describe('state', function() {
        it('should dehydrate and rehydrate game state', function() {
            var gameState = gameStateUtil.getNewState({});
            var dehydrated = gameStateUtil.dehydrate(gameState);
            var rehydrated = gameStateUtil.rehydrate({}, dehydrated);

            expect(dehydrated.worldTime).to.eql('0632-04-16T00:00:00.000Z');
            expect(rehydrated).to.eql(gameState);
        });
    });
});
