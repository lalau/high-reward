'use strict';

var setupNode = document.querySelector('#setup');
var titleNode = document.querySelector('#title');
var gameNode = document.querySelector('#game');
var troopInfo = require('./troop-info/troop-info.js');
var mapTracing = require('./map-tracing/map-tracing.js');
var mapNavigation = require('./map-navigation/map-navigation.js');
var troopFormation = require('./troop-formation/troop-formation.js');
var contentUpdated = false;
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
    case '#troop-info':
        exampleLib = troopInfo;
        break;
    case '#map-tracing':
        exampleLib = mapTracing;
        break;
    case '#map-navigation':
        exampleLib = mapNavigation;
        break;
    case '#troop-formation':
        exampleLib = troopFormation;
        break;
    default:
        exampleLib = troopInfo;
    }

    return exampleLib;
}

function updateContent(href) {
    var hash = href.substr(href.indexOf('#'));
    initExample(getExampleLib(hash));
}

document.querySelector('#example-list').addEventListener('click', function(e) {
    updateContent(e.target.href);
    contentUpdated = true;
});

window.addEventListener('popstate', function() {
    if (!contentUpdated) {
        updateContent(document.location.href);
    }
    contentUpdated = false;
});

initExample(getExampleLib(window.location.hash));
