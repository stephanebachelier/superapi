module.exports = {
  build: [
    'clean',
    'transpile:amd',
    'transpile:commonjs',
    'concat:amd',
    'uglify'
  ],
  default: [
    'build'
  ],
  doc: [
    'groc'
  ]
};
