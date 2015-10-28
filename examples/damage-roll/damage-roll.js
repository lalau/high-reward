'use strict';

var battleUtil = require('../../lib/utils/battle-util');

function calculate() {
    var attack = parseInt(document.querySelector('#attack').value);
    var defense = parseInt(document.querySelector('#defense').value);
    var defenseFactor = parseInt(document.querySelector('#defense-factor').value);
    var count = 1000000;
    var result = '';
    var damages = {};
    var damage;

    for (var i=0; i<count; i++) {
        damage = battleUtil.getDamage(attack, defense, defenseFactor);
        damages[damage] = damages[damage] || 0;
        damages[damage]++;
    }

    for (damage in damages) {
        result += damage + ' = ' + (100 * damages[damage]/count) + '%' + '\n';
    }

    document.querySelector('#result').innerHTML = result;
}

function init() {
    calculate();

    document.querySelector('#calculate').addEventListener('click', calculate);
}

function getSetup() {
    return  '<div>' +
                '<label for="attack">Attack:</label>' +
                ' ' +
                '<input name="attack" id="attack" value="10" size="5"></input>' +
                ' ' +
                '<label for="defense">Defense:</label>' +
                ' ' +
                '<input name="defense" id="defense" value="10" size="5"></input>' +
                ' ' +
                '<label for="defense-factor">Defense Factor:</label>' +
                ' ' +
                '<input name="defense-factor" id="defense-factor" value="0.2" size="5"></input>' +
                ' ' +
                '<button id="calculate">Calculate</button>' +
                '<pre id="result"></pre>' +
            '</div>';
}

function getName() {
    return 'Damage Roll Calculation';
}

module.exports = {
    init: init,
    getName: getName,
    getSetup: getSetup
};
