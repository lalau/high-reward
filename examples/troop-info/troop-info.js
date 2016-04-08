'use strict';

var STATES = require('../../configs/states');
var InitGame = require('../../lib/states/init-game');
var TroopInfo = require('../../lib/states/troop-info');
var gameStateUtil = require('../../lib/utils/game-state-util');
var Unit = require('../../lib/models/unit');
var game;

function init() {
    var selectCommander = document.querySelector('#select-commander');
    var selectOrder = document.querySelector('#select-order');
    var selectMember = document.querySelector('#select-member');

    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(STATES.InitGame, InitGame);
    game.state.add(STATES.TroopInfo, TroopInfo);

    game.state.start(STATES.InitGame, undefined, undefined, function() {
        game.gameState = gameStateUtil.getNewState();
        game.state.start(STATES.TroopInfo, undefined, undefined, 'moro');
        updateSetup('moro');
    });

    selectCommander.addEventListener('change', function(e) {
        var troopInfoScreen = game.state.states[game.state.current]._screen;
        var commanderKey = e.target.value;

        troopInfoScreen.setTroop(game.gameState.troops[commanderKey]);
        updateSetup(commanderKey);
    });

    selectOrder.addEventListener('change', function(e) {
        var commanderKey = selectCommander.value;
        game.gameState.troops[commanderKey].order = e.target.value;
    });

    selectMember.addEventListener('change', function(e) {
        var target = e.target;
        var index = target.id.replace('select-member-', '');
        var configs = target.value.split(',');
        var unitKey = configs[0];
        var preset = configs[1];
        var members = game.gameState.troops[selectCommander.value].members;

        if (unitKey) {
            members[index] = new Unit({ key: unitKey, preset: preset });
        } else {
            members[index] = null;
        }
    });

    return game;
}

function updateSetup(commanderKey) {
    var troop = game.gameState.troops[commanderKey];

    troop.members.forEach(function(member, index) {
        if (member && member.type !== 'commander') {
            document.querySelector('#select-member-' + index).value = member.key;
        }
    });

    document.querySelector('#select-order').value = troop.order;
}

function getSetup() {
    var selectMembers = '';
    var memberCount;

    for (memberCount = 0; memberCount < 10; memberCount++) {
        selectMembers += '<li style="display:inline-block;">' + getSelectMember(memberCount + 1) + '</li> ';
    }

    return  '<form>' +
                '<label for="select-commander">Commander:</label>' +
                '<select name="commander" id="select-commander">' +
                    '<option value="moro">Moro</option>' +
                    '<option value="jesse">Jesse</option>' +
                    '<option value="lu">Lu</option>' +
                    '<option value="sal">Sal</option>' +
                '</select>' +
                ' ' +
                '<label for="select-order">Order:</label>' +
                '<select name="order" id="select-order">' +
                    '<option value="stay">Stay</option>' +
                    '<option value="idle">Idle</option>' +
                    '<option value="retreat">Retreat</option>' +
                '</select>' +
                ' ' +
                '<p style="margin-bottom:0">Members:</p>' +
                '<ol id="select-member" style="margin:0;padding:0">' + selectMembers + '</ol>' +
            '</form>';
}

function getSelectMember(index) {
    return  index + ': ' +
            '<select name="member' + index + '" id="select-member-' + index + '">' +
                '<option value=""></option>' +
                '<option value="infantry">Infantry</option>' +
                '<option value="infantry,a">Infantry a</option>' +
                '<option value="infantry,b">Infantry b</option>' +
                '<option value="armoured-infantry">Armoured Infantry</option>' +
                '<option value="armoured-infantry,a">Armoured Infantry a</option>' +
                '<option value="armoured-infantry,b">Armoured Infantry b</option>' +
                '<option value="mechanized-infantry">Mech Infantry</option>' +
                '<option value="mechanized-infantry,a">Mech Infantry a</option>' +
                '<option value="mechanized-infantry,b">Mech Infantry b</option>' +
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
