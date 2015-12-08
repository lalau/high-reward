'use strict';

var SelectMenu = require('../../menus/select-menu');
var _ = {
    capitalize: require('lodash/string/capitalize'),
    padLeft: require('lodash/string/padLeft'),
    padRight: require('lodash/string/padRight')
};
var Region = require('../../components/region');

function PostingPanel(game, x, y, postings) {
    SelectMenu.call(this, game, x, y, PostingPanel.WIDTH, this._getMenu(postings));

    this.events.onSelect = new Phaser.Signal();
    this._initClick(postings);
}

PostingPanel.prototype = Object.create(SelectMenu.prototype);

PostingPanel.WIDTH = 588;

PostingPanel.PAD_WORK = 21;
PostingPanel.PAD_COUNTRY = 11;
PostingPanel.PAD_DESTINATION = 23;
PostingPanel.PAD_CLIENT = 14;
PostingPanel.PAD_DAYS = 4;
PostingPanel.PAD_REWARD = 8;

PostingPanel.prototype._getMenu = function(postings) {
    var menu = {};

    menu.align = 'left';
    menu.textScale = 1;
    menu.title = [
        _.padRight('WORK', PostingPanel.PAD_WORK),
        _.padRight('COUNTRY', PostingPanel.PAD_COUNTRY),
        _.padRight('DESTINATION', PostingPanel.PAD_DESTINATION),
        _.padRight('CLIENT', PostingPanel.PAD_CLIENT),
        _.padLeft('DAYS', PostingPanel.PAD_DAYS),
        _.padLeft('REWARD', PostingPanel.PAD_REWARD)
    ].join('');
    menu.options = postings.map(function(posting, index) {
        var workTitle = _.capitalize(posting.item) + ' Delivery';
        return {
            key: index + '',
            text: [
                _.padRight(workTitle, PostingPanel.PAD_WORK),
                _.padRight(Region.Regions[posting.country].name, PostingPanel.PAD_COUNTRY),
                _.padRight(Region.Pois[posting.country][posting.destination].name, PostingPanel.PAD_DESTINATION),
                _.padRight(posting.name, PostingPanel.PAD_CLIENT),
                _.padLeft(posting.days, PostingPanel.PAD_DAYS),
                _.padLeft(posting.reward + 'G', PostingPanel.PAD_REWARD)
            ].join('')
        };
    });

    return menu;
};

PostingPanel.prototype._initClick = function(postings) {
    var options = this._menu.options;

    options.forEach(function(option, index) {
        this.onClick(index + '', this.events.onSelect.dispatch.bind(this.events.onSelect, postings[index]));
    }, this);
};

module.exports = PostingPanel;
