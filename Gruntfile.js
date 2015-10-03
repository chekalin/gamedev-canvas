module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        clean: {
            build: ['build']
        },
        concat: {
            main: {
                src: ['src/**/*.js'],
                dest: 'build/app.js'
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'src',
                src: ['index.html', 'styles.css'],
                dest: 'build/'
            }
        },
        watch: {
            all: {
                files: ['src/**/*.js'],
                tasks: ['build']
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', ['clean', 'concat', 'copy']);
};