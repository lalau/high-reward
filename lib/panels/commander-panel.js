'use strict';

var Panel = require('./panel');

function CommanderPanel(game, x, y) {
    Panel.call(this, game, x, y, CommanderPanel.WIDTH, CommanderPanel.HEIGHT);
}

CommanderPanel.prototype = Object.create(Panel.prototype);

CommanderPanel.WIDTH = 140;
CommanderPanel.HEIGHT = 302;

CommanderPanel.prototype.render = function(commander) {
    this._commander = commander;
    this._renderPortrait();
    this._renderName();
    this._renderCommander();
    this._renderAttributes();
};

CommanderPanel.prototype._renderPortrait = function() {
    var portraitKey = this._commander.key + '-portrait';

    if (this._portrait) {
        if (this._portrait.key === portraitKey) {
            return;
        }
        this._portrait.destroy();
    } else {
        this.renderText(Panel.X_PADDING, 7, 'COMMANDER');
        this._renderPortraitBorder();
    }

    this._portrait = new Phaser.Image(this.game, Panel.X_PADDING + 1, 16, portraitKey);
    this.addChild(this._portrait);
};

CommanderPanel.prototype._renderPortraitBorder = function() {
    var border = new Phaser.Graphics(this.game, Panel.X_PADDING, 15);
    var areaWidth = CommanderPanel.WIDTH - Panel.X_PADDING - Panel.X_PADDING - 1;

    border.lineStyle(1, 0x000000, 1);
    border.drawRect(0, 0, areaWidth, 159);
    this.addChild(border);
};

CommanderPanel.prototype._renderName = function() {
    var name = this._commander.shortName.toUpperCase();

    if (this._nameText) {
        if (this._nameText.text === name) {
            return;
        }
        this._nameText.setText(name);
        return;
    }

    this.renderText(Panel.X_PADDING, 179, 'NAME');
    this._nameText = this.renderText(Panel.X_PADDING, 187, name, { type: 'value', scale: 2 });
};

CommanderPanel.prototype._renderCommander = function() {
    var assetKey = this._commander.key + '-stand';

    if (this._commanderImage) {
        if (this._commanderImage.key === assetKey) {
            return;
        }
        this._commanderImage.destroy();
    }

    this._commanderImage = new Phaser.Image(this.game, Panel.X_PADDING, 207, assetKey);
    this.addChild(this._commanderImage);
};

CommanderPanel.prototype._renderAttributes = function() {
    var x2 = CommanderPanel.WIDTH - Panel.X_PADDING;
    var attrs = this._commander.attrs;

    this.renderAttributeGroup('basic', 46, x2, 215, [
        { key: 'HP', value: attrs.hp, max: attrs.maxHp },
        { key: 'EXPERT', value: attrs.expert },
        { key: 'FATIGUE', value: attrs.fatigue }
    ]);

    this.renderAttributeGroup('combat', Panel.X_PADDING, x2, 251, [
        { key: 'SHOOT', value: attrs.shoot },
        { key: 'DEFENCE', value: attrs.defence }
    ]);

    this.renderAttributeGroup('skill', Panel.X_PADDING, x2, 271, [
        { key: 'TRADING', value: attrs.trading },
        { key: 'PERFORMANCE', value: attrs.performance },
        { key: 'BUILDING', value: attrs.building }
    ]);
};

module.exports = CommanderPanel;
