module.exports = {
  amd: {
    options: {
      mangle: true
    },
    files: {
      'dist/amd/<%= package.name %>.amd.min.js': ['dist/amd/<%= package.name %>.amd.js'],
    }
  },
  browser: {
    options: {
      mangle: true
    },
    files: {
      'dist/<%= package.name %>.min.js': ['dist/<%= package.name %>.js'],
    }
  }
};
