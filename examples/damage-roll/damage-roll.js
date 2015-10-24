'use strict';

function rollDice(count, sides) {
    var value = 0;

    while(count--) {
        value += Math.floor(Math.random() * (sides + 1));
    }

    return value;
}

function getDamage(attack, defense, defenseFactor) {
    return Math.max(0,
        Math.min(attack + rollDice(2, 2), attack + rollDice(2, 2)) -
        Math.floor(
            (defense + rollDice(2, 2)) * defenseFactor / 100
        )
    );
}

function calculate() {
    var attack = parseInt(document.querySelector('#attack').value);
    var defense = parseInt(document.querySelector('#defense').value);
    var defenseFactor = parseInt(document.querySelector('#defense-factor').value);
    var result = '';
    var damages = {};
    var damage;

    for (var i=0; i<1000000; i++) {
        damage = getDamage(attack, defense, defenseFactor);
        damages[damage] = damages[damage] || 0;
        damages[damage]++;
    }

    for (damage in damages) {
        result += damage + ' = ' + (100*damages[damage]/1000000) + '%' + '\n';
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
                '<input name="defense-factor" id="defense-factor" value="20" size="5"></input>' +
                ' ' +
                '<button id="calculate">Calculate</button>' +
                '<pre id="result"></pre>'
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
