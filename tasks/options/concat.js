module.exports = {
  amd: {
    src: ['tmp/<%= package.name %>/**/*.amd.js', 'tmp/<%= package.name %>.amd.js'],
    dest: 'dist/amd/<%= package.name %>.amd.js',
    options: {
      banner: '/**\n' +
              '  @module <%= package.name %>\n' +
              '  @version <%= package.version %>\n' +
              '  @copyright <%= package.author %>\n' +
              '  @license <%= package.license %>\n' +
              '  */\n'
    }
  },

  amdNoVersion: {
    src: ['tmp/<%= package.name %>/**/*.amd.js', 'tmp/<%= package.name %>.amd.js'],
    dest: 'dist/amd/<%= package.name %>.amd.js'
  },

  deps: {
    src: ['vendor/deps/*.js'],
    dest: 'tmp/deps.amd.js'
  },

  browser: {
    src: ['./assets/loader.js', 'tmp/<%= package.name %>/**/*.amd.js', 'tmp/<%= package.name %>.amd.js'],
    dest: 'tmp/<%= package.name %>.browser1.js'
  }
};
