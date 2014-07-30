module.exports = {
  amd: {
    options: {
      mangle: true
    },
    files: {
      'dist/amd/<%= package.name %>.amd.min.js': ['dist/amd/<%= package.name %>.amd.js'],
    }
  }
};
