'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var moment = require('moment');
var gameStateUtil;

function MockRegion(game, name) {
    this.name = name;
}
MockRegion.prototype.getName = function() {
    return this.name;
};
MockRegion.Pois = {zelerd: require('../../../../configs/maps/zelerd/poi')};

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
            var gameState = gameStateUtil.getNewState();
            var dehydrated;
            var rehydrated;

            gameState.nextCollectDate = moment('0632-04-21T00:00:00.000Z').utc();
            gameState.lastPaidDate = '0632-04-23';

            dehydrated = gameStateUtil.dehydrate(gameState);
            rehydrated = gameStateUtil.rehydrate(dehydrated);

            // normalize moment object to string to be test-able
            gameState.nextCollectDate = gameState.nextCollectDate.toISOString();
            rehydrated.nextCollectDate = rehydrated.nextCollectDate.toISOString();

            expect(dehydrated.worldTime).to.eql('0632-04-16T00:00:00.000Z');
            expect(rehydrated).to.eql(gameState);
        });
    });
});
