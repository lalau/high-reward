'use strict';

var BarPanel = require('./city-info-bar-panel');
var TextPanel = require('../common/text-panel');

function CityInfoScreen(game, regionInfo, poi) {
    Phaser.Group.call(this, game, null, 'city-info-screen');

    this._panels = {
        bar: this.addChild(new BarPanel(game, 'center', 106, regionInfo, poi)),
        info: this.addChild(new TextPanel(game, 'center', 130, 588, 100, poi.description, {
            multiline: true,
            title: 'EXPLAIN'
        }))
    };
}

CityInfoScreen.prototype = Object.create(Phaser.Group.prototype);

module.exports = CityInfoScreen;
