'use strict';

var mapUtil = require('../utils/map-util');
var Pathfinder = require('../utils/pathfinder');
var Navicon = require('../components/navicon');
var _ = {
    find: require('lodash/collection/find'),
    forEach: require('lodash/collection/forEach')
};

function Region(game, name, grid, pois) {
    Phaser.Image.call(this, game, 0, 0, name + '-map');

    this._config = {
        name: name,
        grid: grid,
        pois: pois
    };

    this.inputEnabled = true;
    this.onClick = new Phaser.Signal();

    this._initGrid();
    _.forEach(pois, this._initPoi, this);

    this._navicons = {};
}

Region.FRIENDLY = 1;
Region.HOSTILE = 2;

Region.prototype = Object.create(Phaser.Image.prototype);

Region.prototype.getName = function() {
    return this._config.name;
};

Region.prototype._initGrid = function() {
    var grid = this._config.grid;
    var pathfinder = new Pathfinder(grid);

    this.pathfinder = pathfinder;
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
        this.onClick.dispatch({
            type: 'poi',
            point: { x: poi.x, y: poi.y },
            poi: poi
        });
    }, this);

    this.addChild(poiGraphic);
};

Region.prototype._handleMapClick = function(bg, pointer) {
    var pointerX = Math.round(pointer.x);
    var pointerY = Math.round(pointer.y);
    var nearestPoint = this._getNearestPoint(pointerX, pointerY, 6);

    this.onClick.dispatch({
        type: 'path',
        point: nearestPoint
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

Region.prototype.addNavicon = function(navicon) {
    this._navicons[navicon.name] = navicon;
    this.addChild(navicon);
};

Region.prototype.removeNavicon = function(key) {
    var navicon = key instanceof Navicon ? key : this.getNavicon(key);

    key = navicon.name;

    if (navicon) {
        navicon.destroy();
        this._navicons[key] = undefined;
    }
};

Region.prototype.getNavicon = function(key) {
    return this._navicons[key];
};

Region.prototype.hasNavicon = function(key) {
    return !!this.getNavicon(key);
};

Region.prototype.getPoi = function(key) {
    return this._config.pois[key];
};

Region.prototype.getPoiByPoint = function(x, y) {
    return _.find(this._config.pois, function(poi) {
        return poi.x === x && poi.y === y;
    });
};

Region.prototype.renderFlags = function(flags) {
    _.forEach(this._config.pois, function(poi, key) {
        if (flags[key]) {
            this._addFlag(key, flags[key] === Region.FRIENDLY);
        } else {
            this._removeFlag(key);
        }
    }, this);
};

Region.prototype._addFlag = function(key, isFriendly) {
    if (!key) {
        return;
    }

    this._flags = this._flags || {};

    var poi = this.getPoi(key);
    var flags = this._flags;
    var flagKey = isFriendly ? 'blue-flag' : 'red-flag';

    if (flags[key]) {
        if (flags[key].key === flagKey) {
            return;
        } else {
            flags[key].destroy();
        }
    }

    flags[key] = this.addChild(new Phaser.Image(this.game, poi.x, poi.y, flagKey));
    flags[key].anchor = { x: 0.6, y: 1.2 };
};

Region.prototype._removeFlag = function(key) {
    var flags = this._flags;

    if (flags && flags[key]) {
        flags[key].destroy();
        flags[key] = undefined;
    }
};

module.exports = Region;
