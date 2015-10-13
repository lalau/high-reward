'use strict';

var TroopFormationScreen = require('../../lib/screens/troop-formation/troop-formation-screen');
var AssetLoader = require('../../lib/asset-loader');
var Unit = require('../../lib/models/unit');
var Commander = require('../../lib/models/commander');
var Troop = require('../../lib/models/troop');
var game;

var EXAMPLE_MEMBERS = [
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-2'}) },
    { unit: new Unit({key: 'armoured-infantry-1'}) },
    { unit: new Unit({key: 'armoured-infantry-2'}) },
    { unit: new Unit({key: 'mechanized-infantry-1'}) }
];

function preload() {
    var assetLoader = new AssetLoader(game, '../assets/');
    assetLoader.load();
}

function create() {
    var commander = new Commander({ key: 'moro' });
    var troop = new Troop(commander, EXAMPLE_MEMBERS);
    var screen = new TroopFormationScreen(game, troop);

    game.stage.addChild(screen);

    updateDebugInfo(troop);
    screen._panels.formation.events.onMovingUnitEnd.add(function() {
        updateDebugInfo(troop);
    });
}

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', { preload: preload, create: create }, false, false);

    return game;
}

function updateDebugInfo(troop) {
    document.querySelector('#formation-info').innerHTML = 'Formation: ' + JSON.stringify(troop.formation);
}

function getSetup() {
    return  '<pre id="formation-info">Formation: </pre>';
}

function getName() {
    return 'Troop Formation Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
