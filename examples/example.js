'use strict';

var setupNode = document.querySelector('#setup');
var titleNode = document.querySelector('#title');
var gameNode = document.querySelector('#game');
var teamInfo = require('./team-info/team-info.js');
var mapTracing = require('./map-tracing/map-tracing.js');
var mapNavigation = require('./map-navigation/map-navigation.js');
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

function updateContent(href) {
    var hash = href.substr(href.indexOf('#'));
    initExample(getExampleLib(hash));
}

document.querySelector('#example-list').addEventListener('click', function(e) {
    updateContent(e.target.href);
    contentUpdated = true;
});

window.addEventListener('popstate', function(e) {
    if (!contentUpdated) {
        updateContent(document.location.href);
    }
    contentUpdated = false;
});

initExample(getExampleLib(window.location.hash));
