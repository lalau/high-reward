'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var spritesheet = require('spritesheet-js');
var exec = require('child_process').exec;
var keyRenewVersion = '';

module.exports = function (grunt) {
    function compileSpritesheet(options) {
        var done = this.async();
        var buildName = options.buildName;
        var buildPath = options.buildPath;
        var outputPath = path.resolve(buildPath);
        var config = {
            path: buildPath,
            name: buildName
        };

        spritesheet(options.target, config, function(err) {
            if (err) {
                throw err;
            }
            grunt.log.ok('spritesheet generated for ' + buildName);
            getHash(outputPath, buildName, function(hash) {
                var assetsHashPath = path.resolve(options.configPath) + '/assets.json';
                var assetsHash;

                try {
                    assetsHash = fs.readFileSync(assetsHashPath, 'utf8');
                } catch (e) {
                    assetsHash = fs.readFileSync(path.resolve('configs/assets.json'), 'utf8');
                    fs.writeFileSync(assetsHashPath, assetsHash, 'utf8');
                }

                assetsHash = JSON.parse(assetsHash);
                assetsHash.spritesheets[buildName] = hash;
                fs.writeFileSync(assetsHashPath, JSON.stringify(assetsHash, null, 4), 'utf8');
                fs.renameSync(outputPath + '/' + buildName + '.json', outputPath + '/' + buildName + /*'.' + hash.json +*/ '.json');
                fs.renameSync(outputPath + '/' + buildName + '.png', outputPath + '/' + buildName + '.' + hash.spritesheet + '.png');

                done();
            });
        });
    }

    function getHash(path, name, callback) {
        // var json = fs.readFileSync(path + '/' + name + '.json', 'utf8');
        exec('identify -verbose ' + path + '/' + name + '.png | grep signature', function (err, stdout) {
            callback({
                // json: crypto.createHash('md5').update(json + keyRenewVersion, 'utf8').digest('hex'),
                spritesheet: crypto.createHash('md5').update(stdout + keyRenewVersion, 'utf8').digest('hex')
            });
        });
    }

    grunt.registerMultiTask('spritesheet', function() {
        var self = this;
        var options = this.options();
        var outputPath = path.resolve(options.buildPath);

        this.async();

        try {
            fs.statSync(outputPath);
        } catch (e) {
            mkdirp(outputPath, function () {
                compileSpritesheet.call(self, options);
            });
            return;
        }

        compileSpritesheet.call(this, options);
    });
};
