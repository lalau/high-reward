'use strict';

var Panel = require('../components/panel');
var textUtil = require('../utils/text-util');
var _ = {
    forEach: require('lodash/collection/forEach')
};

function SelectMenu(game, x, y, width, menu) {
    menu.options = menu.options || [];
    menu.align = menu.align || 'center';
    menu.textScale = menu.textScale || 1.5;

    var menuHeight = SelectMenu.getMenuHeight(menu);

    if (y + menuHeight > game.height - 10) {
        y = game.height - menuHeight - 10;
    }

    Panel.call(this, game, x, y, width, menuHeight);

    this._menu = menu;
    this._textX = menu.align !== 'center' ? Panel.X_PADDING : width / 2;

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

SelectMenu.prototype._render = function() {
    this.beginFill(0xAA5500);

    this._renderTitle();
    this._renderOptions();

    this.endFill();
};

SelectMenu.prototype._renderTitle = function() {
    var menu = this._menu;
    var width = this._config.width;
    var title = menu.title;

    if (!title) {
        return;
    }

    var textY = 5 + (menu.textScale === 1.5 ? 0 : 2);

    this.drawRect(SelectMenu.X_PADDING, SelectMenu.TOP_PADDING, width - SelectMenu.X_PADDING - SelectMenu.X_PADDING, SelectMenu.TITLE_HEIGHT);
    textUtil.renderText(this.game, this._textX, textY, title, { scale: menu.textScale, align: menu.align, fill: SelectMenu.TITLE_FILL, parent: this });
};

SelectMenu.prototype._renderOptions = function() {
    var menu = this._menu;
    var width = this._config.width;
    var menuOptions = menu.options;
    var optionTextConfig = { scale: menu.textScale, align: menu.align, fill: SelectMenu.OPTION_FILL, parent: this };
    var optionTexts = {};
    var optionY = SelectMenu.TOP_PADDING + (menu.title ? SelectMenu.TITLE_HEIGHT : 0);
    var textY;

    menuOptions.forEach(function(menuOption, optionIndex) {
        optionY += SelectMenu.OPTION_PADDING;
        textY = optionY + (menu.textScale === 1.5 ? 0 : 2);
        optionTexts[menuOption.key] = textUtil.renderText(this.game, this._textX, textY, menuOption.text, optionTextConfig);
        optionY += SelectMenu.OPTION_HEIGHT;
        if (optionIndex < menuOptions.length - 1) {
            this.drawRect(3, optionY, width - SelectMenu.X_PADDING - SelectMenu.X_PADDING, 1);
        }
        optionY += 1;
    }, this);

    this._optionTexts = optionTexts;
};

SelectMenu.prototype._setupInput = function() {
    var width = this._config.width - SelectMenu.X_PADDING - SelectMenu.X_PADDING;
    var hitArea;

    if (this._menu.align === 'center') {
        hitArea = new Phaser.Polygon([
            { x: -width / 2, y: 0 },
            { x: -width / 2, y: 13 },
            { x: width / 2, y: 13 },
            { x: width / 2, y: 0 }
        ]);
    } else {
        hitArea = new Phaser.Polygon([
            { x: 0, y: 0 },
            { x: 0, y: 13 },
            { x: width, y: 13 },
            { x: width, y: 0 }
        ]);
    }

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

SelectMenu.getMenuHeight = function(menu) {
    return  SelectMenu.TOP_PADDING +
            (menu.title ? SelectMenu.TITLE_HEIGHT : 0) +
            (menu.options.length - 1) + // option separators
            (SelectMenu.OPTION_PADDING + SelectMenu.OPTION_HEIGHT) * (menu.options.length) +
            2; // bottom space
};

module.exports = SelectMenu;
