'use strict';

var InitGame = require('../../lib/states/init-game');
var TroopInfo = require('../../lib/states/troop-info');
var gameStateUtil = require('../../lib/utils/game-state-util');
var Unit = require('../../lib/models/unit');
var Troop = require('../../lib/models/troop');
var game;

function init() {
    var selectCommander = document.querySelector('#select-commander');
    var selectOrder = document.querySelector('#select-order');
    var selectMember = document.querySelector('#select-member');

    game = new Phaser.Game(640, 400, Phaser.AUTO, 'game', null, false, false);
    game.state.add(InitGame.NAME, InitGame);
    game.state.add(TroopInfo.NAME, TroopInfo);

    game.state.start(InitGame.NAME, undefined, undefined, function() {
        game.gameState = gameStateUtil.getNewState(game);
        game.state.start(TroopInfo.NAME, undefined, undefined, 'moro');
        updateSetup('moro');
    });

    selectCommander.addEventListener('change', function(e) {
        var troopInfoScreen = game.state.states[game.state.current]._screen;
        var commanderKey = e.target.value;
        var commander;

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
        var unitKey = target.value;
        var members = game.gameState.troops[selectCommander.value].members;

        if (unitKey) {
            members[index] = new Unit({ key: unitKey });
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
                '<select name="commander" id="select-commander" value="moro">' +
                    '<option value="moro">Moro</option>' +
                    '<option value="jesse">Jesse</option>' +
                    '<option value="lu">Lu</option>' +
                    '<option value="sal">Sal</option>' +
                '</select>' +
                ' ' +
                '<label for="select-order">Order:</label>' +
                '<select name="order" id="select-order" value="STAY">' +
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
    return 'Troop Info Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
