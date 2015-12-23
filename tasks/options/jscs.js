/*global module*/
'use strict';

module.exports = {
  options: {
    config: '.jscs.json'
  },
  lib: {
    options: {
      esnext: true
    },
    src: ['lib/**/*.js']
  },
  grunt: ['Gruntfile.js', 'tasks/{,*/}*.js'],
  test: ['tests/spec/{,*/}*.js']
};
