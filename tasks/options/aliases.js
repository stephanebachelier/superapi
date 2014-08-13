module.exports = {
  build: [
    'clean',
    // CJS
    'transpile:commonjs',
    // AMD
    'transpile:amd',
    'concat:amd',
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
