'use strict';

var mapUtil = require('../utils/map-util');
var Pathfinder = require('../utils/pathfinder');

function Region(game, name, grid, pois) {
    Phaser.Image.call(this, game, 0, 0, name + '-map');

    this._config = {
        name: name,
        grid: grid,
        pois: pois
    };

    this.inputEnabled = true;
    this._initGrid();
    pois.forEach(this._initPoi, this);
}

Region.prototype = Object.create(Phaser.Image.prototype);

Region.prototype._initGrid = function() {
    var grid = this._config.grid;
    var pathfinder = new Pathfinder(grid);

    this._pathfinder = pathfinder;
    this.events.onInputDown.add(this._handleMapClick, this);
};

Region.prototype._initPoi = function(poi) {
    var game = this.game;
    var poiGraphic = new Phaser.Graphics(game, 0, 0);
    var x = poi.x;
    var y = poi.y;

    poiGraphic.inputEnabled = true;
    poiGraphic.input.priorityID = 1;
    poiGraphic.hitArea = new Phaser.Polygon([
        mapUtil.getPointDelta(x, y, 10, 4),
        mapUtil.getPointDelta(x, y, 10, -4),
        mapUtil.getPointDelta(x, y, -10, -4),
        mapUtil.getPointDelta(x, y, -10, 4)
    ]);
    poiGraphic.events.onInputDown.add(function(){
        this._prepareNavigate(poi.x, poi.y);
    }, this);

    this.addChild(poiGraphic);
};

Region.prototype._handleMapClick = function(bg, pointer) {
    var pointerX = Math.round(pointer.x);
    var pointerY = Math.round(pointer.y);
    var nearestPoint = this._getNearestPoint(pointerX, pointerY, 6);

    if (nearestPoint) {
        this._prepareNavigate(nearestPoint.x, nearestPoint.y);
    }
};

Region.prototype._prepareNavigate = function(x, y) {
    var game = this.game;
    var pathfinder = this._pathfinder;
    var navicon = game.state.getCurrentState().getCurrentNavicon();

    pathfinder.findPath(navicon.x, navicon.y, x, y, this._navigate.bind(this));
};

Region.prototype._navigate = function(points) {
    if (!points) {
        return;
    }

    var game = this.game;
    var state = game.state.getCurrentState();
    var navicon = state.getCurrentNavicon();

    state.clearActionQueue();

    points.forEach(function(point) {
        state.scheduleAction(navicon.moveTo.bind(navicon, point.x, point.y));
    });
};

Region.prototype._getNearestPoint = function(x, y, maxRange) {
    var range = 1;
    var gridPoint;
    var found;

    while (range <= maxRange) {
        found = mapUtil.getDeltasAtRange(range).some(function(delta) {
            if (this._getGridValue(x + delta.x, y + delta.y) === 0) {
                gridPoint = {x: x + delta.x, y: y + delta.y};
                return true;
            }
        }, this);
        if (found) {
            return gridPoint;
        }
        range++;
    }
};

Region.prototype._getGridValue = function(x, y) {
    var grid = this._config.grid;

    if (x>=0 && y>=0 && x<grid[0].length && y<grid.length) {
        return grid[y][x];
    }
};

module.exports = Region;
