module.exports = {
  superagentcjs: {
    expand: true,
    cwd: 'lib/superagent/commonjs',
    src: ['*.js'],
    dest: 'dist/commonjs/'
  },
  superagentamd: {
    expand: true,
    cwd: 'lib/superagent/amd',
    src: ['*.js'],
    dest: 'dist/amd/'
  }
};
