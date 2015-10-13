'use strict';

var Panel = require('../../components/panel');
var textUtil = require('../../utils/text-util');

function TroopCommanderPanel(game, x, y, commander) {
    Panel.call(this, game, x, y, TroopCommanderPanel.WIDTH, TroopCommanderPanel.HEIGHT);

    this._commander = commander;

    this._render();
}

TroopCommanderPanel.prototype = Object.create(Panel.prototype);

TroopCommanderPanel.WIDTH = 140;
TroopCommanderPanel.HEIGHT = 302;

TroopCommanderPanel.prototype.setCommander = function(commander) {
    this._commander = commander;
};

TroopCommanderPanel.prototype._render = function() {
    this._renderPortrait();
    this._renderName();
    this._renderCommander();
    this._renderCommanderAttributes();
};

TroopCommanderPanel.prototype._renderPortrait = function() {
    textUtil.renderText(this.game, Panel.X_PADDING, 5, 'COMMANDER', { parent: this });
    this._renderPortraitBorder();
    this._renderPortraitImage();
};

TroopCommanderPanel.prototype._renderPortraitBorder = function() {
    var border = new Phaser.Graphics(this.game, Panel.X_PADDING, 15);
    var areaWidth = TroopCommanderPanel.WIDTH - Panel.X_PADDING - Panel.X_PADDING - 1;

    border.lineStyle(1, 0x000000, 1);
    border.drawRect(0, 0, areaWidth, 159);
    this.addChild(border);
};

TroopCommanderPanel.prototype._renderPortraitImage = function() {
    var portraitKey = this._getPortraitKey();

    this._portrait = new Phaser.Image(this.game, Panel.X_PADDING + 1, 16, portraitKey);
    this.addChild(this._portrait);
};

TroopCommanderPanel.prototype._renderName = function() {
    var game = this.game;
    var name = this._getCommanderDisplayName();

    textUtil.renderText(game, Panel.X_PADDING, 177, 'NAME', { parent: this });
    this._nameText = textUtil.renderText(game, Panel.X_PADDING, 186, name, { type: 'value', scale: 2, parent: this });
};

TroopCommanderPanel.prototype._renderCommander = function() {
    this._renderUnitImage(Panel.X_PADDING, 207, this._commander, 'commander-image');
};

TroopCommanderPanel.prototype._renderCommanderAttributes = function() {
    var attrs = this._commander.attrs;

    this._renderAttributes(48, 213, {
        key: 'basic',
        separator: ':',
        pad: 3,
        fixedLength: 12,
        parent: this,
        attrs: [{
            key: 'hp',
            data: { name: 'HP', value: attrs.hp, max: attrs.maxHp },
            nextLine: 1
        },{
            key: 'exp',
            data: { name: 'EXPERT', value: attrs.expert },
            nextLine: 1
        },{
            key: 'fat',
            data: { name: 'FATIGUE', value: attrs.fatigue }
        }]
    });

    this._renderAttributes(Panel.X_PADDING, 249, {
        key: 'combat',
        separator: ':',
        pad: 3,
        fixedLength: 18,
        parent: this,
        attrs: [{
            key: 'sht',
            data: { name: 'SHOOT', value: attrs.shoot },
            nextLine: 1
        },{
            key: 'def',
            data: { name: 'DEFENCE', value: attrs.defence }
        }]
    });

    this._renderAttributes(Panel.X_PADDING, 269, {
        key: 'skill',
        separator: ':',
        pad: 3,
        fixedLength: 18,
        parent: this,
        attrs: [{
            key: 'trd',
            data: { name: 'TRADING', value: attrs.trading },
            nextLine: 1
        },{
            key: 'perf',
            data: { name: 'PERFORMANCE', value: attrs.performance },
            nextLine: 1
        },{
            key: 'bld',
            data: { name: 'BUILDING', value: attrs.building }
        }]
    });
};

TroopCommanderPanel.prototype._getCommanderDisplayName = function() {
    return this._commander.shortName.toUpperCase();
};

TroopCommanderPanel.prototype._getPortraitKey = function() {
    return this._commander.key + '-portrait';
};

TroopCommanderPanel.prototype.update = function() {
    this._updatePortrait();
    this._updateName();
    this._renderCommander();
    this._renderCommanderAttributes();
};

TroopCommanderPanel.prototype._updatePortrait = function() {
    var portraitKey = this._getPortraitKey();

    if (this._portrait.key !== portraitKey) {
        this._portrait.destroy();
        this._renderPortraitImage();
    }
};

TroopCommanderPanel.prototype._updateName = function() {
    var name = this._getCommanderDisplayName();

    if (this._nameText.text !== name) {
        this._nameText.setText(name);
    }
};

module.exports = TroopCommanderPanel;
