'use strict';

var AssetLoader = require('../../lib/asset-loader');
var Region = require('../../lib/components/region');
var grid = require('../../configs/maps/zelerd/grid');
var pois = require('../../configs/maps/zelerd/poi');
var textUtil = require('../../lib/utils/text-util');
var moment = require('moment');
var pointer;
var game;
var lastUpdatedTime;
var worldTime;
var dateText;
var _ = {
    padLeft: require('lodash/string/padLeft')
};

function preload() {
    var assetLoader = new AssetLoader(game, '../assets/');
    assetLoader.load();
}

function create() {
    var region = new Region(game, 'zelerd', grid, pois);

    pointer = new Phaser.Sprite(game, 17, 285, 'sprites', 'clock-00.png');

    region.addChild(pointer);
    game.stage.addChild(region);

    worldTime = moment('0632-04-16 00', 'YYYY-MM-DD HH');
    dateText = textUtil.renderText(game, 64, 386, worldTime.format('YYYY/MM/DD'), {parent: region, type: 'value', scale: 1, align: 'center'});
    lastUpdatedTime = Date.now();
}

function update() {
    if (lastUpdatedTime + 1000 > Date.now()) {
        return;
    }

    worldTime.add(1, 'h');

    var worldHour = worldTime.hour();
    var frameIndex = worldHour <= 12 ? worldHour : 24 - worldHour;
    var worldDate = worldTime.format('YYYY/MM/DD');

    pointer.frameName = 'clock-' + _.padLeft(frameIndex, 2, 0) + '.png';
    if (dateText.text !== worldDate) {
        dateText.setText(worldDate);
    }

    lastUpdatedTime = Date.now();
}

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', { preload: preload, create: create, update: update }, false, false);

    return game;
}


function getSetup() {
    return  '';
}

function getName() {
    return 'Clock Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
