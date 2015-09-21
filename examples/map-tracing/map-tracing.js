'use strict';

var AssetLoader = require('../../lib/asset-loader');
var Navicon = require('../../lib/navicon');
var traceMoves = require('./trace-zelerd');
var actionQueue;
var traceButton;
var game;
var grid;
var pois;
var navicon;
var trail;

function preload() {
    var assetLoader = new AssetLoader(game, '../assets/');
    assetLoader.load();
}

function create() {
    var map = new Phaser.Image(game, 0, 0, 'zelerd-map');
    map.inputEnabled = true;
    game.stage.addChild(map);

    navicon = new Navicon(game, 'moro', 0, 0);
    map.addChild(navicon);

    trail = new Phaser.Graphics(game, 0, 0);
    map.addChild(trail);

    actionQueue = [];
    grid = initGrid(640, 400);
    pois = [];
}

function update() {
    var action = actionQueue.shift();

    if (action) {
        action();
    }
}

function initGrid(width, height) {
    var grid = [];
    var x;
    var y;

    for (y = 0; y < height; y++) {
        grid[y] = [];
        for (x = 0; x < width; x++) {
            grid[y][x] = 1;
        }
    }

    return grid;
}

function move(dir) {
    navicon['move' + dir.charAt(0).toUpperCase() + dir.slice(1)]();
    grid[navicon.y][navicon.x] = 0;
    mark(0xff0000, navicon);
}

function moveTo(point) {
    navicon.x = point.x;
    navicon.y = point.y;
    grid[navicon.y][navicon.x] = 0;
    mark(0xff0000, navicon);
}

function markPoi(poi) {
    mark(0x00ff00, navicon, 10);
    pois.push({x: navicon.x, y: navicon.y, type: poi.type, name: poi.name});
}

function mark(color, point, size) {
    size = size || 1;
    trail.beginFill(color);
    trail.drawRect(point.x, point.y, size, size);
    trail.endFill();
}

function scheduleTrace(callback) {
    var i;

    traceMoves.forEach(function(action) {
        if (action.moveTo) {
            actionQueue.push(moveTo.bind(null, action.moveTo));
        }
        if (action.move) {
            for (i = 0; i < action.count; i++) {
                actionQueue.push(move.bind(null, action.move));
            }
        }
        if (action.poi) {
            actionQueue.push(markPoi.bind(null, action.poi));
        }
    });
    if (callback) {
        actionQueue.push(callback);
    }
}

function handleTrace() {
    traceButton.disabled = true;
    traceButton.innerHTML = 'Tracing...';
    scheduleTrace(updateSetup);
}

function updateSetup() {
    traceButton.removeEventListener('click', handleTrace);
    traceButton.addEventListener('click', handleViewResult);
    traceButton.innerHTML = 'View Result';
    traceButton.disabled = false;
}

function handleViewResult() {
    window.open().document.write('<head><title>Grid</title></head><body><pre>' + JSON.stringify(grid) + '</pre></body>');
    window.open().document.write('<head><title>POI</title></head><body><pre>' + JSON.stringify(pois, null, 4) + '</pre></body>');
}

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', { preload: preload, create: create, update: update }, false, false);
    traceButton = document.querySelector('#trace-button');
    traceButton.addEventListener('click', handleTrace);

    return game;
}

function getSetup() {
    return  '<div>' +
                '<button id="trace-button">Trace</button>' +
                ' ' +
                '<select name="map" id="select-map" value="zelerd">' +
                    '<option value="zelerd">Zelerd</option>' +
                '</select>' +
            '</div>';
}

function getName() {
    return 'Map Tracing Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
