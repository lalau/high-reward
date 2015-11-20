'use strict';

var AssetLoader = require('../../lib/asset-loader');
var Navicon = require('../../lib/components/navicon');
var Region = require('../../lib/components/region');
var grid = require('../../configs/maps/zelerd/grid');
var pois = require('../../configs/maps/zelerd/poi');
var actionQueue = [];
var poiSelect;
var region;
var navicon;
var game;

function preload() {
    var assetLoader = new AssetLoader(game, '../assets/');
    assetLoader.load();
}

function create() {
    region = new Region(game, 'zelerd', grid, pois);
    navicon = region.addChild(new Navicon(game, 'moro', 352, 310));
    game.stage.addChild(region);

    region.onClick.add(function(e) {
        if (e && e.point) {
            navigate(e.point.x, e.point.y);
        }
    });
}

function update() {
    var action = actionQueue.shift();

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

    navigate(navigatePoi.x, navigatePoi.y);
}

function navigate(x, y) {
    region.pathfinder.findPath(navicon.x, navicon.y, x, y, function(points) {
        if (!points) {
            return;
        }

        points.forEach(function(point){
            actionQueue.push(function() {
                navicon.moveTo(point.x, point.y);
            });
        });
    });
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
