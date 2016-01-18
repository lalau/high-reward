'use strict';

var STATES = require('../../configs/states');

function Navicon(game, name, x, y) {
    x = x === undefined ? 0 : x;
    y = y === undefined ? 0 : y;

    Phaser.Image.call(this, game, x, y, 'sprites', name + '-navicon.png');

    this.name = name;
    this.anchor = {x: 0.5, y: 0.85};
    this.enableInput();
    this.setupMenu();
}

Navicon.prototype = Object.create(Phaser.Image.prototype);

Navicon.prototype.enableInput = function() {
    this.inputEnabled = true;
    this.input.priorityID = 3;
};

Navicon.prototype.setupMenu = function() {
    var game = this.game;

    this.events.onInputDown.add(function(navicon) {
        var troop = game.gameState.troops[navicon.name];

        if (troop.isRetreating) {
            return;
        }

        game.state.start(STATES.TroopMenu, undefined, undefined, {x: navicon.x, y: navicon.y}, troop.commander.key);
    });
};

Navicon.prototype.disableInput = function() {
    this.inputEnabled = false;
};

Navicon.prototype.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
};

Navicon.prototype.moveUp = function() {
    this.x -= 2;
    this.y--;
};

Navicon.prototype.moveLeft = function() {
    this.x--;
    this.y++;
};

Navicon.prototype.moveDown = function() {
    this.x += 2;
    this.y++;
};

Navicon.prototype.moveRight = function() {
    this.x++;
    this.y--;
};

module.exports = Navicon;
