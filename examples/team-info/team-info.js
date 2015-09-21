'use strict';

var CommanderPanel = require('../../lib/commander-panel');
var TroopInfoPanel = require('../../lib/troop-info-panel');
var PersonnelPanel = require('../../lib/personnel-panel');
var Commander = require('../../lib/commander');
var Unit = require('../../lib/unit');
var Troop = require('../../lib/troop');
var AssetLoader = require('../../lib/asset-loader');
var game;
var panels;

function preload() {
    var assetLoader = new AssetLoader(game, '../assets/');
    assetLoader.load();
}

function create() {
    var commanderKey = document.querySelector('#select-commander').value;
    var commander = new Commander({ key: commanderKey });
    var troop = new Troop({ name: commander.troopName });

    panels.commanderPanel = createCommanderPanel(commander);
    panels.troopInfoPanel = createTroopInfoPanel(troop);
    panels.personnelPanel = createPersonnelPanel(troop.members);
}

function createCommanderPanel(commander) {
    var panel = new CommanderPanel(game, 10, 49);
    panel.render(commander);
    game.stage.addChild(panel.getDisplayObject());

    return panel;
}

function createTroopInfoPanel(troop) {
    var panel = new TroopInfoPanel(game, 154, 49);
    panel.render(troop);
    game.stage.addChild(panel.getDisplayObject());

    return panel;
}

function createPersonnelPanel(members) {
    var panel = new PersonnelPanel(game, 154, 145);
    panel.render(members);
    game.stage.addChild(panel.getDisplayObject());

    return panel;
}

function init() {
    var selectCommander = document.querySelector('#select-commander');
    var selectOrder = document.querySelector('#select-order');
    var selectMember = document.querySelector('#select-member');
    var allSelectMembers = selectMember.querySelectorAll('select');

    panels = {};
    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', { preload: preload, create: create }, false, false);

    selectCommander.addEventListener('change', function(e) {
        var commander = new Commander({ key: e.target.value });
        var troop = new Troop({ name: commander.troopName });
        panels.commanderPanel.render(commander);
        panels.troopInfoPanel.render(troop);
        panels.personnelPanel.render(troop.members);
        selectOrder.value = 'STAY';
        Array.prototype.forEach.call(allSelectMembers, function(select) {
            select.value = '';
        });
    });

    selectOrder.addEventListener('change', function(e) {
        panels.troopInfoPanel._troop.order = Troop.Order[e.target.value];
        panels.troopInfoPanel.render();
    });

    selectMember.addEventListener('change', function(e) {
        var target = e.target;
        var index = target.id.replace('select-member-', '');
        var unitKey = target.value;
        var members = panels.troopInfoPanel._troop.members;

        if (unitKey) {
            members[index] = new Unit({ key: unitKey });
        } else {
            members[index] = null;
        }
        panels.personnelPanel.render(members);
    });

    return game;
}

function getSetup() {
    var selectMembers = '';
    var memberCount;

    for (memberCount = 0; memberCount < 10; memberCount++) {
        selectMembers += '<li style="display:inline-block;">' + getSelectMember(memberCount) + '</li> ';
    }

    return  '<form>' +
                '<label for="select-commander">Commander:</label>' +
                '<select name="commander" id="select-commander" value="moro">' +
                    '<option value="moro">Moro</option>' +
                    '<option value="jesse">Jesse</option>' +
                    '<option value="lu">Lu</option>' +
                    '<option value="sal">Sal</option>' +
                '</select>' +
                ' ' +
                '<label for="select-order">Order:</label>' +
                '<select name="order" id="select-order" value="STAY">' +
                    '<option value="STAY">Stay</option>' +
                    '<option value="IDLE">Idle</option>' +
                    '<option value="RETREAT">Retreat</option>' +
                '</select>' +
                ' ' +
                '<p style="margin-bottom:0">Members:</p>' +
                '<ol id="select-member" style="margin:0;padding:0">' + selectMembers + '</ol>' +
            '</form>';
}

function getSelectMember(index) {
    return  index + ': ' +
            '<select name="member' + index + '" id="select-member-' + index + '" value="">' +
                '<option value=""></option>' +
                '<option value="infantry-1">Infantry 1</option>' +
                '<option value="infantry-2">Infantry 2</option>' +
                '<option value="infantry-3">Infantry 3</option>' +
                '<option value="armoured-infantry-1">Armoured Infantry 1</option>' +
                '<option value="armoured-infantry-2">Armoured Infantry 2</option>' +
                '<option value="armoured-infantry-3">Armoured Infantry 3</option>' +
                '<option value="mechanized-infantry-1">Mech Infantry 1</option>' +
                '<option value="mechanized-infantry-2">Mech Infantry 2</option>' +
                '<option value="mechanized-infantry-3">Mech Infantry 3</option>' +
            '</select>';
}

function getName() {
    return 'Team Info Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
