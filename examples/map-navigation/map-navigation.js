'use strict';

var AssetLoader = require('../../lib/asset-loader');
var Navicon = require('../../lib/navicon');
var Region = require('../../lib/region');
var grid = require('../../configs/maps/zelerd/grid');
var pois = require('../../configs/maps/zelerd/poi');
var poiSelect;
var region;
var game;

function preload() {
    var assetLoader = new AssetLoader(game, '../../assets/');
    assetLoader.load();
}

function create() {
    var navicon = new Navicon(game, 'moro', 352, 310);

    this._navicons = {
        moro: navicon
    };
    this._currentNavicon = 'moro';
    this.getCurrentNavicon = function() {
        return this._navicons[this._currentNavicon];
    };

    this._actionQueue = [];
    this.clearActionQueue = function() {
        this._actionQueue = [];
    };
    this.scheduleAction = function(action) {
        this._actionQueue.push(action);
    };

    region = new Region(game, 'zelerd', grid, pois);
    region.addChild(navicon);
    game.stage.addChild(region);
}

function update() {
    var action = this._actionQueue.shift();

    if (action) {
        action();
    }
}

function createPoiOptions(pois) {
    var options = document.createDocumentFragment();
    pois.forEach(function(poi) {
        var option = document.createElement('option');
        option.value = poi.name;
        option.innerHTML = poi.name;
        options.appendChild(option);
    });
    poiSelect.appendChild(options);
}

function handleNavigate() {
    var poiName = poiSelect.value;
    var navigatePoi;

    pois.some(function(poi) {
        if (poi.name === poiName) {
            navigatePoi = poi;
            return true;
        }
    });

    region._prepareNavigate(navigatePoi.x, navigatePoi.y);
}

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', { preload: preload, create: create, update: update }, false, false);
    poiSelect = document.querySelector('#select-poi');
    createPoiOptions(pois);
    document.querySelector('#navigate-button').addEventListener('click', handleNavigate);

    return game;
}


function getSetup() {
    return  '<div>' +
                '<button id="navigate-button">Navigate</button>' +
                ' ' +
                '<select name="map" id="select-map" value="zelerd">' +
                    '<option value="zelerd">Zelerd</option>' +
                '</select>' +
                ' ' +
                '<label for="poi">POI</label>' +
                '<select name="poi" id="select-poi"></select>' +
            '</div>';
}

function getName() {
    return 'Map Navigation Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
