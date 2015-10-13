'use strict';

var TroopInfoScreen = require('../../lib/screens/troop-info/troop-info-screen');
var Commander = require('../../lib/models/commander');
var Unit = require('../../lib/models/unit');
var Troop = require('../../lib/models/troop');
var AssetLoader = require('../../lib/asset-loader');
var game;
var screen;

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
    var commander = new Commander({ key: document.querySelector('#select-commander').value });
    var troop = new Troop(commander, EXAMPLE_MEMBERS);
    screen = new TroopInfoScreen(game, troop);

    game.stage.addChild(screen);
}

function init() {
    var selectCommander = document.querySelector('#select-commander');
    var selectOrder = document.querySelector('#select-order');
    var selectMember = document.querySelector('#select-member');
    var allSelectMembers = selectMember.querySelectorAll('select');

    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', { preload: preload, create: create }, false, false);

    selectCommander.addEventListener('change', function(e) {
        var commander = new Commander({ key: e.target.value });
        var troop = new Troop(commander, EXAMPLE_MEMBERS);

        screen.setTroop(troop);
        selectOrder.value = 'STAY';
        Array.prototype.forEach.call(allSelectMembers, function(select, index) {
            var unit = EXAMPLE_MEMBERS[index] && EXAMPLE_MEMBERS[index].unit;
            select.value = unit && unit.key || '';
        });
    });

    selectOrder.addEventListener('change', function(e) {
        screen._troop.order = Troop.Order[e.target.value];
    });

    selectMember.addEventListener('change', function(e) {
        var target = e.target;
        var index = target.id.replace('select-member-', '');
        var unitKey = target.value;
        var members = screen._troop.members;

        if (unitKey) {
            members[index] = new Unit({ key: unitKey });
        } else {
            members[index] = null;
        }
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
    var unit = EXAMPLE_MEMBERS[index] && EXAMPLE_MEMBERS[index].unit;
    var key = unit && unit.key || '';
    return  index + ': ' +
            '<select name="member' + index + '" id="select-member-' + index + '" value="' + key + '">' +
                '<option value=""></option>' +
                '<option ' + (key === 'infantry-1' ? 'selected' : '') + ' value="infantry-1">Infantry 1</option>' +
                '<option ' + (key === 'infantry-2' ? 'selected' : '') + ' value="infantry-2">Infantry 2</option>' +
                '<option ' + (key === 'infantry-3' ? 'selected' : '') + ' value="infantry-3">Infantry 3</option>' +
                '<option ' + (key === 'armoured-infantry-1' ? 'selected' : '') + ' value="armoured-infantry-1">Armoured Infantry 1</option>' +
                '<option ' + (key === 'armoured-infantry-2' ? 'selected' : '') + ' value="armoured-infantry-2">Armoured Infantry 2</option>' +
                '<option ' + (key === 'armoured-infantry-3' ? 'selected' : '') + ' value="armoured-infantry-3">Armoured Infantry 3</option>' +
                '<option ' + (key === 'mechanized-infantry-1' ? 'selected' : '') + ' value="mechanized-infantry-1">Mech Infantry 1</option>' +
                '<option ' + (key === 'mechanized-infantry-2' ? 'selected' : '') + ' value="mechanized-infantry-2">Mech Infantry 2</option>' +
                '<option ' + (key === 'mechanized-infantry-3' ? 'selected' : '') + ' value="mechanized-infantry-3">Mech Infantry 3</option>' +
            '</select>';
}

function getName() {
    return 'Troop Info Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
