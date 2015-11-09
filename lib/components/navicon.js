'use strict';

function Navicon(game, name, x, y) {
    x = x === undefined ? 0 : x;
    y = y === undefined ? 0 : y;

    this.name = name;

    Phaser.Image.call(this, game, x, y, name + '-navicon');
    this.anchor = {x: 0.5, y: 0.85};
    this.inputEnabled = true;
    this.input.priorityID = 3;
}

Navicon.prototype = Object.create(Phaser.Image.prototype);

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
