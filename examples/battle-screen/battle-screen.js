'use strict';

var BattleScreen = require('../../lib/screens/battle/battle-screen');
var AssetLoader = require('../../lib/asset-loader');
var Unit = require('../../lib/models/unit');
var Commander = require('../../lib/models/commander');
var Troop = require('../../lib/models/troop');
var game;
var screen;
var controlButton;

var EXAMPLE_MEMBERS_1 = [
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-1'}) }
];

var EXAMPLE_MEMBERS_2 = [
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-1'}) },
    { unit: new Unit({key: 'infantry-2'}) },
    { unit: new Unit({key: 'armoured-infantry-1'}) },
    { unit: new Unit({key: 'armoured-infantry-2'}) },
    { unit: new Unit({key: 'armoured-infantry-2'}) },
    { unit: new Unit({key: 'mechanized-infantry-1'}) },
    { unit: new Unit({key: 'mechanized-infantry-1'}) },
    { unit: new Unit({key: 'mechanized-infantry-1'}) },
    { unit: new Unit({key: 'mechanized-infantry-1'}) }
];

function preload() {
    var assetLoader = new AssetLoader(game, '../assets/');
    assetLoader.load();
}

function create() {
    var commander1 = new Commander({ key: 'moro' });
    var commander2 = new Commander({ key: 'moro' });
    var troop1 = new Troop(commander1, EXAMPLE_MEMBERS_1);
    var troop2 = new Troop(commander2, EXAMPLE_MEMBERS_2);

    troop1.formationIndex = 1;
    troop2.formationIndex = 10;

    screen = new BattleScreen(game, troop1, troop2);

    game.stage.addChild(screen);
}

function init() {
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', { preload: preload, create: create }, false, false);

    controlButton = document.querySelector('#control');
    controlButton.addEventListener('click', control);

    return game;
}

function control() {
    var battle = screen._battle;

    if (!battle) {
        controlButton.innerHTML = 'Pause';
        screen.start();
        return;
    }

    if (screen.isPaused()) {
        controlButton.innerHTML = 'Pause';
        screen.resume();
    } else {
        controlButton.innerHTML = 'Resume';
        screen.pause();
    }
}

function getSetup() {
    return '<button id="control">Start</button>';
}

function getName() {
    return 'Battle Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
