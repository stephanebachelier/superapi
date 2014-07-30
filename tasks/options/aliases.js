module.exports = {
  build: [
    'clean',
    // CJS
    'transpile:commonjs',
    'copy:superagentcjs',
    // AMD
    'transpile:amd',
    'concat:amd',
    'copy:superagentamd',
    'uglify:amd',
    // Browser
    'concat:browser',
    'browser:dist',
    'uglify:browser'
  ],
  'lint-test': [
    'jshint:test',
    'jscs:test',
    'lintspaces:test'
  ],
  default: [
    'build'
  ],
  dev: [
    'karma:unit:start',
    'watch'
  ],
  doc: [
    'groc'
  ]
};
