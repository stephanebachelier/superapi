/*global module*/
'use strict';

module.exports = {
  options: {
    jshintrc: '.jshintrc',
    reporter: require('jshint-stylish')
  },
  lib: {
    src: ['lib/**/*.js']
  },
  grunt: {
    src: ['Gruntfile.js', 'tasks/options/{,/*}*.js']
  },
  test: {
    src: ['tests/spec/{,*/}*.js']
  }
};
