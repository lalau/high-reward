'use strict';

var Navicon = require('../components/navicon');
var mapUtil = require('../utils/map-util');
var Pathfinder = require('../utils/pathfinder');
var _ = {
    find: require('lodash/collection/find'),
    forEach: require('lodash/collection/forEach')
};
var grid = { zelerd: require('../../configs/maps/zelerd/grid') };
var pois = { zelerd: require('../../configs/maps/zelerd/poi') };
var regions = { zelerd: require('../../configs/maps/zelerd/region') };

function Region(game, name) {
    Phaser.Image.call(this, game, 0, 0, 'screens', name + '.png');

    this._config = {
        name: name,
        grid: grid[name],
        pois: pois[name]
    };

    this.inputEnabled = true;
    this.onClick = new Phaser.Signal();

    this._initGrid();
    _.forEach(pois[name], this._initPoi, this);

    this._poiImageGroup = new Phaser.Group(game, this, 'region-poi-images');
    this._poiImages = {};

    this._flagGroup = new Phaser.Group(game, this, 'region-flags');
    this._flags = {};

    this._naviconGroup = new Phaser.Group(game, this, 'region-navicons');
    this._navicons = {};
}

Region.Grid = grid;
Region.Pois = pois;
Region.Regions = regions;

Region.FRIENDLY = 1;
Region.HOSTILE = 2;

Region.prototype = Object.create(Phaser.Image.prototype);

Region.prototype.getName = function() {
    return this._config.name;
};

Region.prototype.getInfo = function() {
    return regions[this._config.name];
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
    this._naviconGroup.addChild(navicon);
};

Region.prototype.removeNavicon = function(key) {
    var navicon = key instanceof Navicon ? key : this.getNavicon(key);

    key = navicon.name;

    if (navicon) {
        navicon.destroy();
        this._navicons[key] = undefined;
    }
};

Region.prototype.toggleNavicons = function(enable) {
    _.forEach(this._navicons, function(navicon) {
        if (navicon) {
            if (enable) {
                navicon.enableInput();
            } else {
                navicon.disableInput();
            }
        }
    });
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

    var poi = this.getPoi(key);
    var flags = this._flags;
    var frameName = (isFriendly ? 'blue-flag' : 'red-flag') + '.png';

    if (flags[key]) {
        if (flags[key].frameName === frameName) {
            return;
        } else {
            flags[key].destroy();
        }
    }

    flags[key] = this._flagGroup.addChild(new Phaser.Image(this.game, poi.x, poi.y, 'icons', frameName));
    flags[key].anchor = { x: 0.6, y: 1.2 };
};

Region.prototype._removeFlag = function(key) {
    var flags = this._flags;

    if (flags && flags[key]) {
        flags[key].destroy();
        flags[key] = undefined;
    }
};

Region.prototype.renderPoi = function(poi) {
    if (!poi) {
        return;
    }

    var poiImages = this._poiImages;
    var poiKey = poi.key;
    var poiConfig = this._config.pois[poiKey];
    var poiDurability = poi.attributes.durability;
    var frameName;
    var level;

    if (poiDurability < 50) {
        level = 1;
    } else if (poiDurability < 100) {
        level = 2;
    } else if (poiDurability < 200) {
        level = 3;
    } else {
        level = 4;
    }

    frameName = poiConfig.type + '-' + level + '.png';

    if (poiImages[poiKey]) {
        if (poiImages[poiKey].frameName === frameName) {
            return;
        } else {
            poiImages[poiKey].destroy();
        }
    }

    poiImages[poiKey] = this._poiImageGroup.addChild(new Phaser.Image(this.game, poiConfig.x, poiConfig.y, 'icons', frameName));
    poiImages[poiKey].anchor = {x: 0.5, y: 0.525};
};

module.exports = Region;
