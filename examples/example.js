'use strict';

var setupNode = document.querySelector('#setup');
var titleNode = document.querySelector('#title');
var gameNode = document.querySelector('#game');
var teamInfo = require('./team-info/team-info.js');
var mapTracing = require('./map-tracing/map-tracing.js');
var mapNavigation = require('./map-navigation/map-navigation.js');
var game;

function initExample(lib) {
    var setupFragment;

    titleNode.innerHTML = lib.getName();
    setupFragment = document.createRange().createContextualFragment(lib.getSetup());
    setupNode.innerHTML = '';
    setupNode.appendChild(setupFragment);
    gameNode.innerHTML = '';

    if (game) {
        game.destroy();
    }

    game = lib.init();
}

function getExampleLib(hash) {
    var exampleLib;

    switch(hash) {
    case '#team-info':
        exampleLib = teamInfo;
        break;
    case '#map-tracing':
        exampleLib = mapTracing;
        break;
    case '#map-navigation':
        exampleLib = mapNavigation;
        break;
    default:
        exampleLib = teamInfo;
    }

    return exampleLib;
}

document.querySelector('#example-list').addEventListener('click', function(e) {
    var href = e.target.href;
    var hash = href.substr(href.indexOf('#'));

    initExample(getExampleLib(hash));
});

initExample(getExampleLib(window.location.hash));
