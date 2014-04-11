/*global module*/
'use strict';

module.exports = {
  options: {
    config: '.jscs.json'
  },
  grunt: ['Gruntfile.js', 'tasks/{,*/}*.js'],
  test: ['tests/spec/{,*/}*.js']
};
