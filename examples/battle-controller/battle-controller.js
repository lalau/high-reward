'use strict';

var BattleController = require('../../lib/utils/battle-controller');
var Unit = require('../../lib/models/unit');
var Commander = require('../../lib/models/commander');
var Troop = require('../../lib/models/troop');
var formations = require('../../configs/formations');
var table = require('text-table');

var EXAMPLE_MEMBERS_1 = [
    { unit: new Unit({key: 'infantry'}) },
    { unit: new Unit({key: 'infantry'}) },
    { unit: new Unit({key: 'infantry'}) },
    { unit: new Unit({key: 'infantry'}) },
    { unit: new Unit({key: 'infantry'}) },
    { unit: new Unit({key: 'infantry'}) },
    { unit: new Unit({key: 'infantry'}) },
    { unit: new Unit({key: 'infantry'}) },
    { unit: new Unit({key: 'infantry'}) },
    { unit: new Unit({key: 'infantry'}) }
];

var EXAMPLE_MEMBERS_2 = [
    { unit: new Unit({key: 'infantry'}) },
    { unit: new Unit({key: 'infantry'}) },
    { unit: new Unit({key: 'infantry', preset: 'a'}) },
    { unit: new Unit({key: 'armoured-infantry'}) },
    { unit: new Unit({key: 'armoured-infantry', preset: 'a'}) },
    { unit: new Unit({key: 'armoured-infantry', preset: 'a'}) },
    { unit: new Unit({key: 'mechanized-infantry'}) },
    { unit: new Unit({key: 'mechanized-infantry'}) },
    { unit: new Unit({key: 'mechanized-infantry'}) },
    { unit: new Unit({key: 'mechanized-infantry'}) }
];

function init() {
    var commander1 = new Commander({ key: 'moro' });
    var commander2 = new Commander({ key: 'moro' });
    var troop1 = new Troop(commander1, EXAMPLE_MEMBERS_1);
    var troop2 = new Troop(commander2, EXAMPLE_MEMBERS_2);
    var battle;

    troop1.formationIndex = 6;
    troop2.formationIndex = 6;

    troop1.members.forEach(function(unit) {
        if (unit) {
            unit.updateItem('item', 'recovery-10');
        }
    });

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

    if (status.wonTroopIndex !== undefined) {
        return 'Battle ended. Troop ' + status.wonTroopIndex + ' won.\n';
    }

    battle._troops.forEach(function(troop) {
        var formation = formations[troop.formationIndex];

        troop.members.forEach(function(unit, unitIndex) {
            var slotIndex = troop.getSlotIndex(unit);
            var row = rows[unitIndex] || [];
            var slotPosition = formation.slots[slotIndex];
            rows[unitIndex] = row;
            row.push(unitIndex === 0 ? 'L' : unitIndex,
                unit.attrs.hp + '/' + unit.attrs.maxHp,
                slotPosition.gx + ',' + slotPosition.gy, '', '',
                status.suppressedUnits.indexOf(unit) >= 0 ? 'x' : '',
                status.candidatesWaitingToFire.filter(function(candidate) {
                    return candidate.unit === unit;
                }).length > 0 ? 'x' : '',
                ''
            );
        });
    });

    status.firingCandidates.forEach(function(candidate) {
        var troopIndex = candidate.troopIndex;
        var targetTroop = battle._troops[troopIndex ? 0 : 1];
        var rowIndex = candidate.unitIndex;
        var columnIndex = troopIndex ? 11 : 3;
        var infoColumnIndex = troopIndex ? 12 : 4;
        var targetMemberIndex = targetTroop.getMemberIndex(candidate.target);
        var fireStatus = candidate.fireStatus || {};

        rows[rowIndex][columnIndex] = (targetMemberIndex === 0 ? 'L' : targetMemberIndex) + ' / ' + (candidate.suppressingRound || 3);
        rows[rowIndex][infoColumnIndex] = fireStatus.damage ? -fireStatus.damage : (fireStatus.missed ? 'miss' : '');
    });

    rows.unshift(['Index', 'HP', 'Position', 'Firing', 'Info', 'Suppressed', 'Waiting', '', 'Index', 'HP', 'Position', 'Firing', 'Info', 'Suppressed', 'Waiting', '']);

    return 'Round ' + status.round + '\n' + table(rows, {hsep: '|', align: ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c']});
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
