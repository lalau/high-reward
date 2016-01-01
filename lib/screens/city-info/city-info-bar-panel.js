'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');

function CityInfoBarPanel(game, x, y, regionInfo, poi) {
    Panel.call(this, game, x, y, CityInfoBarPanel.WIDTH, CityInfoBarPanel.HEIGHT);

    this._poi = poi;
    this._regionInfo = regionInfo;

    this._render();
}

CityInfoBarPanel.prototype = Object.create(Panel.prototype);

CityInfoBarPanel.WIDTH = 588;
CityInfoBarPanel.HEIGHT = 22;

CityInfoBarPanel.prototype._render = function() {
    this._renderIcon();
    this._renderName();
    this._renderStatus();
};

CityInfoBarPanel.prototype._renderIcon = function() {
    var icon = new Phaser.Graphics(this.game, Panel.X_PADDING, 4);
    icon.beginFill(0xDBCBCB);
    icon.drawRect(0, 0, 15, 15);
    icon.endFill();
    this.addChild(icon);
};

CityInfoBarPanel.prototype._renderName = function() {
    var location = this._regionInfo.name + ' : ' + this._poi.name;
    textUtil.renderText(this.game, 22, 6, location, { parent: this, type: 'value', scale: 1.25 });
};

CityInfoBarPanel.prototype._renderStatus = function() {
    var poi = this._poi;
    var poiAttributes = poi.attributes;
    var airportIcon;

    this._renderAttributes(370, 8, {
        key: 'city',
        parent: this,
        attrs: [{
            key: 'state',
            data: { name: 'STATE', value: poiAttributes.durability, max: poiAttributes.durability },
            nextSpace: 1
        },{
            key: 'atk',
            data: { name: 'ATK', value: poiAttributes.attack },
            nextSpace: 1
        },{
            key: 'def',
            data: { name: 'DEF', value: poiAttributes.defense },
            nextSpace: 1
        }]
    });

    if (poi.airport) {
        airportIcon = new Phaser.Image(this.game, CityInfoBarPanel.WIDTH - Panel.X_PADDING, 3, 'icons', 'airport.png');
        airportIcon.anchor.x = 1;
        this.addChild(airportIcon);
    }
};

module.exports = CityInfoBarPanel;
