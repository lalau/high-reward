'use strict';

var browserify = require('browserify');

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.loadTasks('grunt');

    grunt.initConfig({
        spritesheet: {
            options: {
                buildPath: 'build/assets/images',
                configPath: 'build/assets'
            },
            icons: {
                options: {
                    target: 'assets/icons/**/*.png',
                    buildName: 'icons'
                }
            },
            portraits: {
                options: {
                    target: 'assets/portraits/**/*.png',
                    buildName: 'portraits'
                }
            },
            screens: {
                options: {
                    target: 'assets/screens/**/*.png',
                    buildName: 'screens'
                }
            },
            sprites: {
                options: {
                    target: 'assets/sprites/**/*.png',
                    buildName: 'sprites'
                }
            }
        },

        s3: {
            options: {
                accessKeyId: process.env.AWS_accessKeyId,
                secretAccessKey: process.env.AWS_secretAccessKey,
                bucket: process.env.AWS_bucket,
                region: process.env.AWS_region
            },
            assets: {
                cwd: 'build',
                src: ['assets/images/*.png'],
                options: {
                    overwrite: false
                }
            },
            game: {
                cwd: 'build',
                src: ['index.html']
            }
        },

        cloudfront: {
            options: {
                accessKeyId: process.env.AWS_accessKeyId,
                secretAccessKey: process.env.AWS_secretAccessKey,
                distributionId: process.env.AWS_distributionId
            },
            game: {
                options: {
                    invalidations: ['/index.html']
                }
            }
        },

        browserify: {
            game: {
                src: ['game/game.js'],
                dest: 'build/game.js'
            }
        },

        replace: {
            game: {
                src: 'build/game.js',
                dest: 'build/game.js',
                replacements: [
                    {
                        from: '/*hrEnv*/',
                        to: 'isProd: true'
                    }
                ]
            }
        },

        uglify: {
            game: {
                src: 'build/game.js',
                dest: 'build/game.js'
            }
        },

        cssmin: {
            game: {
                files: [
                    {
                        src: 'game/game.css',
                        dest: 'build/game.css'
                    }
                ]
            }
        },

        copy: {
            game: {
                files: [
                    {
                        src: 'game/index.html',
                        dest: 'build/index.html'
                    }
                ]
            }
        },

        comboall: {
            game: {
                files: [
                    {
                        'build/index.html': ['build/index.html']
                    }
                ]
            }
        },

        clean: {
            assets: [
                'build/assets/*'
            ]
            ,
            game: [
                'build/*',
                '!build/assets'
            ]
        }
    });

    grunt.registerTask('assets-dev', ['clean:assets', 'spritesheet']);
    grunt.registerTask('assets', ['assets-dev', 's3:assets']);
    grunt.registerTask('compile', ['clean:game', 'browserify', 'replace', 'uglify', 'cssmin', 'copy', 'comboall']);
    grunt.registerTask('deploy', ['s3:game', 'cloudfront:game']);
};
