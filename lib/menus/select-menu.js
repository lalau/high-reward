'use strict';

var Panel = require('../components/panel');
var textUtil = require('../utils/text-util');
var _ = {
    forEach: require('lodash/collection/forEach')
};

function SelectMenu(game, x, y, width, menu) {
    Panel.call(this, game, x, y, width, this._getMenuHeight(menu));

    this._menu = menu;

    this._render();
    this._setupInput();
}

SelectMenu.prototype = Object.create(Panel.prototype);

SelectMenu.TOP_PADDING = 3;
SelectMenu.X_PADDING = 3;
SelectMenu.TITLE_HEIGHT = 16;
SelectMenu.OPTION_PADDING = 2;
SelectMenu.OPTION_HEIGHT = 13;
SelectMenu.TITLE_FILL = '#FFCB95';
SelectMenu.OPTION_FILL = '#968686';
SelectMenu.HOVER_OPTION_FILL = '#FFFFFF';

SelectMenu.prototype._getMenuHeight = function(menu) {
    return  SelectMenu.TOP_PADDING + SelectMenu.TITLE_HEIGHT +
            (menu.options.length - 1) + // option separators
            (SelectMenu.OPTION_PADDING + SelectMenu.OPTION_HEIGHT) * (menu.options.length) +
            2; // bottom space
};

SelectMenu.prototype._render = function() {
    var menu = this._menu;
    var menuOptions = menu.options;
    var optionTexts = {};
    var optionTextConfig = { scale: 1.5, align: 'center', fill: SelectMenu.OPTION_FILL, parent: this };
    var optionY = SelectMenu.TOP_PADDING + SelectMenu.TITLE_HEIGHT;
    var width = this._config.width;

    this.beginFill(0xAA5500);
    this.drawRect(SelectMenu.X_PADDING, SelectMenu.TOP_PADDING, width - SelectMenu.X_PADDING - SelectMenu.X_PADDING, SelectMenu.TITLE_HEIGHT);

    textUtil.renderText(this.game, width / 2, 5, menu.title, { scale: 1.5, align: 'center', fill: SelectMenu.TITLE_FILL, parent: this });

    menuOptions.forEach(function(menuOption, optionIndex) {
        optionY += SelectMenu.OPTION_PADDING;
        optionTexts[menuOption.key] = textUtil.renderText(this.game, width / 2, optionY, menuOption.text, optionTextConfig);
        optionY += SelectMenu.OPTION_HEIGHT;
        if (optionIndex < menuOptions.length - 1) {
            this.drawRect(3, optionY, width - SelectMenu.X_PADDING - SelectMenu.X_PADDING, 1);
        }
        optionY += 1;
    }, this);

    this.endFill();

    this._optionTexts = optionTexts;
};

SelectMenu.prototype._setupInput = function() {
    var width = this._config.width - SelectMenu.X_PADDING - SelectMenu.X_PADDING;
    var hitArea = new Phaser.Polygon([
        { x: -width / 2, y: 0 },
        { x: -width / 2, y: 13 },
        { x: width / 2, y: 13 },
        { x: width / 2, y: 0 }
    ]);

    _.forEach(this._optionTexts, function(optionText) {
        optionText.inputEnabled = true;
        optionText.hitArea = hitArea;
        optionText.input.priorityID = 200;
        optionText.events.onInputOver.add(function() {
            if (optionText.fill !== SelectMenu.HOVER_OPTION_FILL) {
                optionText.fill = SelectMenu.HOVER_OPTION_FILL;
            }
        });
        optionText.events.onInputOut.add(function() {
            if (optionText.fill !== SelectMenu.OPTION_FILL) {
                optionText.fill = SelectMenu.OPTION_FILL;
            }
        });
    });
};

SelectMenu.prototype.update = function() {
    var optionText = this._selectedOptionKey && this._optionTexts[this._selectedOptionKey];

    if (optionText) {
        if (this._optionFlashCount === undefined) {
            this._optionFlashCount = 6;
            this._lastUpdateTime = Date.now();
        }
        if (this._lastUpdateTime + 60 < Date.now()) {
            if (this._optionFlashCount > 0) {
                this._optionFlashCount--;
                optionText.fill = this._optionFlashCount % 2 ? SelectMenu.OPTION_FILL : SelectMenu.HOVER_OPTION_FILL;
                this._lastUpdateTime = Date.now();
            } else {
                this._selectedOptionCallback.call(this._selectedOptionCallbackContext);
                this._optionFlashCount = undefined;
                this._selectedOptionKey = undefined;
                this._selectedOptionCallback = undefined;
                this._selectedOptionCallbackContext = undefined;
                this._lastUpdateTime = undefined;
            }
        }
    }
};

SelectMenu.prototype.onClick = function(optionKey, callback, context) {
    var optionText = this._optionTexts[optionKey];

    if (!optionText) {
        return;
    }

    optionText.events.onInputDown.add(function() {
        this._selectedOptionKey = optionKey;
        this._selectedOptionCallback = callback;
        this._selectedOptionCallbackContext = context;
    }, this);
};

module.exports = SelectMenu;
