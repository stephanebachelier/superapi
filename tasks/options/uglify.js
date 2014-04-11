module.exports = {
  amd: {
    options: {
      mangle: true
    },
    files: {
      'dist/<%= package.name %>.amd.min.js': ['dist/<%= package.name %>.amd.js'],
    }
  }
};
