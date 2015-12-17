'use strict';

var Panel = require('../components/panel');
var textUtil = require('../utils/text-util');

function SelectMenu(game, x, y, width, menu) {
    this.game = game;
    this._menu = menu;
    menu.options = menu.options || [];
    menu.align = menu.align || 'center';
    menu.textScale = menu.textScale || 1.5;
    width = width === 'auto' ? SelectMenu.getAutoMenuWidth(menu) : width;
    this._textX = menu.align !== 'center' ? Panel.X_PADDING : width / 2;

    var height = SelectMenu.getMenuHeight(menu);
    var menuXY = this._getMenuXY(x, y, width, height);

    Panel.call(this, game, menuXY.x, menuXY.y, width, height);

    this._render();
}

SelectMenu.prototype = Object.create(Panel.prototype);

SelectMenu.TOP_PADDING = 3;
SelectMenu.X_PADDING = 3;
SelectMenu.TITLE_HEIGHT = 16;
SelectMenu.OPTION_PADDING = 2;
SelectMenu.OPTION_HEIGHT = 13;
SelectMenu.TITLE_FILL = '#FFCB95';
SelectMenu.OPTION_FILL = '#535353';
SelectMenu.HOVER_OPTION_FILL = '#FFFFFF';
SelectMenu.ENABLE_OPTION_FILL = '#968686';

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

SelectMenu.prototype._setupInput = function(optionKey) {
    var optionText = this._optionTexts[optionKey];
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

    optionText.inputEnabled = true;
    optionText.hitArea = hitArea;
    optionText.input.priorityID = 200;
    optionText.events.onInputOver.add(function() {
        if (optionText.fill !== SelectMenu.HOVER_OPTION_FILL) {
            optionText.fill = SelectMenu.HOVER_OPTION_FILL;
        }
    });
    optionText.events.onInputOut.add(function() {
        if (optionText.fill !== SelectMenu.ENABLE_OPTION_FILL) {
            optionText.fill = SelectMenu.ENABLE_OPTION_FILL;
        }
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
                optionText.fill = this._optionFlashCount % 2 ? SelectMenu.ENABLE_OPTION_FILL : SelectMenu.HOVER_OPTION_FILL;
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

    optionText.fill = SelectMenu.ENABLE_OPTION_FILL;
    this._setupInput(optionKey);

    optionText.events.onInputDown.add(function() {
        this._selectedOptionKey = optionKey;
        this._selectedOptionCallback = callback;
        this._selectedOptionCallbackContext = context;
    }, this);
};

SelectMenu.prototype._getMenuXY = function(x, y, width, height) {
    var game = this.game;

    if (x === 'center') {
        x = Math.floor((game.width - width) / 2);
    } else if (x === 'pointer') {
        x = Math.floor(game.input.x - width / 2);
    }

    if (y === 'center') {
        y = Math.floor((game.height - height) / 2);
    } else if (y === 'pointer') {
        y = Math.floor(game.input.y - SelectMenu.OPTION_HEIGHT);
    }

    x = Math.max(Math.min(x, game.width - width - 5), 5);
    y = Math.max(Math.min(y, game.height - height - 5), 5);

    return {
        x: x,
        y: y
    };
};

SelectMenu.getMenuHeight = function(menu) {
    return  SelectMenu.TOP_PADDING +
            (menu.title ? SelectMenu.TITLE_HEIGHT : 0) +
            (menu.options.length - 1) + // option separators
            (SelectMenu.OPTION_PADDING + SelectMenu.OPTION_HEIGHT) * (menu.options.length) +
            2; // bottom space
};

SelectMenu.getAutoMenuWidth = function(menu) {
    var maxCharCount = 0;

    menu.options.forEach(function(option) {
        maxCharCount = Math.max(maxCharCount, option.text.length);
    });

    if (menu.title) {
        maxCharCount = Math.max(maxCharCount, menu.title.length);
    }

    return maxCharCount * 12 + 16;
};

module.exports = SelectMenu;
