/*global module*/
'use strict';

module.exports = {
  code: {
    files: ['lib/**/*.js'],
    tasks: ['build']
  },
  json: {
    files: ['<%= jsonlint.target.src %>'],
    tasks: ['jsonlint']
  },
  grunt: {
    files: ['Gruntfile.js', 'tasks/{,*/}*.js'],
    tasks: ['jscs:grunt', 'lintspaces:grunt']
  },
  test: {
    files: ['tests/spec/**/*.js'],
    tasks: ['lint-test', 'karma:unit:run']
  },
};
