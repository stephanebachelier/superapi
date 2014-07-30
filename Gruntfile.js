/* global require, module */
'use strict';

module.exports = function (grunt) {

  var path = require('path');

  grunt.loadTasks('tasks/');

  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), './tasks/options'),
    init: true
  });
};
