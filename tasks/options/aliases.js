module.exports = {
  build: [
    'clean',
    'transpile:amd',
    'transpile:commonjs',
    'concat:amd',
    'copy:superagentcjs',
    'copy:superagentamd',
    'uglify'
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
