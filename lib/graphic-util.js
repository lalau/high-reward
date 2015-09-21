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

module.exports = graphicUtil;
