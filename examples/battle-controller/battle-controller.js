'use strict';

var BattleController = require('../../lib/utils/battle-controller');
var Unit = require('../../lib/models/unit');
var Commander = require('../../lib/models/commander');
var Troop = require('../../lib/models/troop');
var formations = require('../../configs/formations');
var table = require('text-table');

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
    { unit: new Unit({key: 'infantry-1'}) },
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

function init() {
    var commander1 = new Commander({ key: 'moro' });
    var commander2 = new Commander({ key: 'moro' });
    var troop1 = new Troop(commander1, EXAMPLE_MEMBERS_1);
    var troop2 = new Troop(commander2, EXAMPLE_MEMBERS_2);
    var battle;

    troop1.formationIndex = 1;
    troop2.formationIndex = 10;

    battle = new BattleController(troop1, troop2);

    document.querySelector('#next').addEventListener('click', function() {
        var newRoundInfo = document.createElement('pre');
        battle.nextRound();
        newRoundInfo.innerHTML = formatRoundInfo(battle);
        document.querySelector('#game').appendChild(newRoundInfo);
    });

    window.battle = battle;
}

function formatRoundInfo(battle) {
    var status = battle.getStatus();
    var rows = [];

    battle._troops.forEach(function(troop, troopIndex) {
        var formation = formations[troop.formationIndex];
        var commanderSlotIndex = troop.getSlotIndex(troop.commander);
        var row;

        troop.members.forEach(function(unit, unitIndex) {
            var slotIndex = troop.getSlotIndex(unit);
            var row = rows[unitIndex] || [];
            rows[unitIndex] = row;
            row.push(unitIndex,
                unit.attrs.hp,
                JSON.stringify(formation.slots[slotIndex]), '',
                status.suppressedUnits.indexOf(unit) >= 0 ? 'x' : '',
                status.candidatesWaitingToFire.filter(function(candidate) {
                    return candidate.unit === unit;
                }).length > 0 ? 'x' : '',
                ''
            );
        });

        row = rows[troop.members.length] || [];
        rows[troop.members.length] = row;
        row.push('L',
            troop.commander.attrs.hp,
            JSON.stringify(formation.slots[commanderSlotIndex]), '',
            status.suppressedUnits.indexOf(troop.commander) >= 0 ? 'x' : '',
            status.candidatesWaitingToFire.filter(function(candidate) {
                return candidate.unit === troop.commander;
            }).length > 0 ? 'x' : '',
            ''
        );
    });

    status.firingCandidates.forEach(function(candidate) {
        var troopIndex = candidate.troopIndex;
        var troop = battle._troops[troopIndex];
        var targetTroop = battle._troops[troopIndex ? 0 : 1];
        var rowIndex = candidate.unitIndex === 'L' ? 10 : candidate.unitIndex;
        var columnIndex = troopIndex ? 10 : 3;

        rows[rowIndex][columnIndex] = targetTroop.getMemberIndex(candidate.target) + ' / ' + (candidate.suppressingRound || 3);
    });

    rows.unshift(['Unit Index', 'HP', 'Slot Position', 'Firing At', 'Suppressed', 'Waiting', '', 'Unit Index', 'HP', 'Slot Position', 'Firing At', 'Suppressed', 'Waiting', '']);

    return 'Round ' + status.round + '\n' + table(rows, {hsep: '|', align: ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c']});
}

function getSetup() {
    return '<style>#setup{width:100%}</style>' +
        '<button id="next">Next Round</button>';
}

function getName() {
    return 'Battle Controller Example';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
