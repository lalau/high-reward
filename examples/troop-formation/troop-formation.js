'use strict';

var TroopFormationSetupPanel = require('../../lib/panels/troop-formation-setup-panel');
var TroopFormationPanel = require('../../lib/panels/troop-formation-panel');
var TroopFormationInfoPanel = require('../../lib/panels/troop-formation-info-panel');
var TroopFormationTitlePanel = require('../../lib/panels/troop-formation-title-panel');
var AssetLoader = require('../../lib/asset-loader');
var Unit = require('../../lib/unit');
var Commander = require('../../lib/commander');
var Troop = require('../../lib/troop');
var game;
var panels;

var EXAMPLE_MEMBERS = [
    new Unit({key: 'infantry-1'}),
    new Unit({key: 'infantry-1'}),
    new Unit({key: 'infantry-2'}),
    new Unit({key: 'armoured-infantry-1'}),
    new Unit({key: 'armoured-infantry-2'}),
    new Unit({key: 'mechanized-infantry-1'})
];

function preload() {
    var assetLoader = new AssetLoader(game, '../assets/');
    assetLoader.load();
}

function create() {
    var commander = new Commander({ key: 'moro' });
    var troop = new Troop({ commander: commander });

    addExampleMembers(troop);

    panels.troopFormationSetupPanel = createTroopFormationSetupPanel(troop);
    panels.troopFormationPanel = createTroopFormationPanel(troop);
    panels.troopFormationInfoPanel = createTroopFormationInfoPanel();
    panels.troopFormationTitlePanel = createTroopFormationTitlePanel(troop);

    initPanelEvents(troop);
    updateDebugInfo(troop);
}

function createTroopFormationSetupPanel(troop) {
    var panel = new TroopFormationSetupPanel(game, 178, 17, troop);
    game.stage.addChild(panel);

    return panel;
}

function createTroopFormationPanel(troop) {
    var panel = new TroopFormationPanel(game, 178, 49, troop);
    game.stage.addChild(panel);

    return panel;
}

function createTroopFormationInfoPanel() {
    var panel = new TroopFormationInfoPanel(game, 178, 265);
    game.stage.addChild(panel);

    return panel;
}

function createTroopFormationTitlePanel(troop) {
    var panel = new TroopFormationTitlePanel(game, 178, 361, troop);
    game.stage.addChild(panel);

    return panel;
}

function initPanelEvents(troop) {
    panels.troopFormationPanel.events.onMovingUnitStart.add(function(unit) {
        panels.troopFormationSetupPanel.disableButtons();
        panels.troopFormationInfoPanel.setUnit(unit);
    });

    panels.troopFormationPanel.events.onMovingUnitEnd.add(function() {
        panels.troopFormationSetupPanel.enableButtons();
        panels.troopFormationInfoPanel.setUnit(null);
        updateDebugInfo(troop);
    });
}

function init() {
    panels = {};
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', { preload: preload, create: create }, false, false);

    return game;
}

function addExampleMembers(troop) {
    EXAMPLE_MEMBERS.forEach(function(unit, index) {
        troop.addMember(unit, index);
    });
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
