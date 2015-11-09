'use strict';

var graphicUtil = {};

graphicUtil.drawVerticalLine = function(graphic, x, y1, y2) {
    graphic.moveTo(x, y1);
    graphic.lineTo(x, y2);
};

graphicUtil.drawHorizontalLine = function(graphic, x1, x2, y) {
    graphic.moveTo(x1, y);
    graphic.lineTo(x2, y);
};

graphicUtil.getHoverBorder = function(game, x, y, width, height) {
    var hoverBorder = new Phaser.Graphics(game, x, y);

    hoverBorder.lineStyle(1, 0xFFAA75, 1);
    graphicUtil.drawHorizontalLine(hoverBorder, 0, width, -1);
    graphicUtil.drawVerticalLine(hoverBorder, width, -1, height - 2);
    graphicUtil.drawVerticalLine(hoverBorder, width + 1, -2, height);
    graphicUtil.drawHorizontalLine(hoverBorder, 0, width - 1, height);
    graphicUtil.drawHorizontalLine(hoverBorder, -1, width + 1, height + 1);
    graphicUtil.drawVerticalLine(hoverBorder, -1, -1, height - 1);
    graphicUtil.drawVerticalLine(hoverBorder, -2, -2, height + 1);

    return hoverBorder;
};

graphicUtil.getClickMask = function(game) {
    var clickMask = new Phaser.Graphics(game, 0, 0);

    clickMask.drawRect(0, 0, game.width, game.height);
    clickMask.inputEnabled = true;
    clickMask.input.priorityID = 2;
    clickMask.hitArea = new Phaser.Polygon([
        { x: 0, y: 0 },
        { x: 0, y: game.height },
        { x: game.width, y: game.height },
        { x: game.width, y: 0 }
    ]);

    return clickMask;
};

module.exports = graphicUtil;
