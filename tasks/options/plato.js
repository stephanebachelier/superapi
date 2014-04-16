/*global module*/
'use strict';

module.exports = function (grunt) {
  return {
    options: {
      jshint: grunt.file.readJSON('.jshintrc')
    },
    report: {
      files: {
        report: [
          '<%= concat.amd.dest %>',
          'test/*.js'
        ]
      }
    }
  };
};
