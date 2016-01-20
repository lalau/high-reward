'use strict';

var AssetLoader = require('../../lib/asset-loader');
var BattleUnit = require('../../lib/components/battle-unit');
var Unit = require('../../lib/models/unit');
var Commander = require('../../lib/models/commander');
var game;
var animatingUnit;

function preload() {
    var assetLoader = new AssetLoader(game);
    assetLoader.load();
}

function create() {
    game.stage.backgroundColor = 0x999999;

    var selectUnit = document.querySelector('#select-unit');
    var selectSide = document.querySelector('#select-side');
    var selectWeapon = document.querySelector('#select-weapon');
    var unitValues = selectUnit.value.split(',');
    var unitKey = unitValues[0];
    var unitType = unitValues[1] || 'unit';

    if (animatingUnit) {
        animatingUnit.destroy();
    }

    animatingUnit = getBattleUnit(unitKey, unitType, selectSide.value, selectWeapon.value);
    animatingUnit.onUnitKilled.add(function() {
        setTimeout(create, 300);
    });
}

function getBattleUnit(unitKey, unitType, side, withWeapon) {
    var UnitClass = unitType === 'unit' ? Unit : Commander;
    var unit = new UnitClass({ key: unitKey });

    if (withWeapon) {
        unit.updateItem('weapon', 'canan-1688');
        unit.updateItem('protection', 'aluminium-armor');
    } else {
        unit.updateItem('weapon');
        unit.updateItem('protection');
    }

    return game.stage.addChild(new BattleUnit(game, game.world.centerX - BattleUnit.WIDTH/2, game.world.centerY - BattleUnit.HEIGHT/2, unit, side));
}

function animateAction(action) {
    setTimeout(function(){
        animatingUnit[action]();
    }, 300);
}

function init() {
    document.querySelector('#select-unit').addEventListener('change', function() {
        create();
    });
    document.querySelector('#select-side').addEventListener('change', function() {
        create();
    });
    document.querySelector('#select-weapon').addEventListener('change', function() {
        create();
    });

    document.querySelector('#action-buttons').addEventListener('click', function(e) {
        animateAction(e.target.getAttribute('data-animate'));
    });

    game = new Phaser.Game(100, 100, Phaser.AUTO, 'game', { preload: preload, create: create }, false, false);

    return game;
}

function getSetup() {
    return  '<div>' +
                '<label for="select-unit">Unit:</label>' +
                ' ' +
                '<select name="unit" id="select-unit" value="moro">' +
                    '<option value="moro,commander">Moro</option>' +
                    '<option value="infantry">Infantry</option>' +
                    '<option value="armoured-infantry">Armoured Infantry</option>' +
                    '<option value="mechanized-infantry">Mechanized Infantry</option>' +
                    '<option value="heavy-infantry">Heavy Infantry</option>' +
                '</select>' +
                ' ' +
                '<label for="select-side">Side:</label>' +
                ' ' +
                '<select name="side" id="select-side" value="right">' +
                    '<option value="right">Right</option>' +
                    '<option value="left">Left</option>' +
                '</select>' +
                ' ' +
                '<label for="select-side">With Weapon:</label>' +
                ' ' +
                '<select name="weapon" id="select-weapon" value="1">' +
                    '<option value="1">Yes</option>' +
                    '<option value="">No</option>' +
                '</select>' +
                '<div id="action-buttons">' +
                    '<button data-animate="animateFire">Fire</label>' +
                    '<button data-animate="animateHit">Hit</label>' +
                    '<button data-animate="animateCriticalHit">Critical Hit</label>' +
                    '<button data-animate="animateMiss">Miss</label>' +
                    '<button data-animate="animateDie">Die</label>' +
                '</div>' +
            '</div>';
}

function getName() {
    return 'Unit Animation Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
