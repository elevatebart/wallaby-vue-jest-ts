module.exports = () => {
  process.env.BABEL_ENV = 'test';
  return {
    files: [
      'src/**/*',
      { pattern: 'test/unit/jest.conf.js', instrument: false },
      { pattern: 'test/unit/setup.js', instrument: false },
      'tsconfig.json'
    ],

    tests: ['test/unit/**/*.spec.ts'],

    env: {
      type: 'node',
      runner: 'node',
    },

    preprocessors: {
      '**/*.js?(x)': file => require('babel-core').transform(
        file.content,
        {
          sourceMap: true, compact: false, filename: file.path,
          plugins: ['transform-es2015-modules-commonjs'], presets: ['babel-preset-jest']
        })
    },

    setup(wallaby) {
      const jestConfig = require('./test/unit/jest.conf');

      delete jestConfig.rootDir;
      delete jestConfig.mapCoverage;
      jestConfig.setupFiles[0] = jestConfig.setupFiles[0].replace('<rootDir>', wallaby.projectCacheDir);
      jestConfig.moduleNameMapper = {
        '^@/components/([^\\.]*)$': wallaby.projectCacheDir + '/src/components/$1.vue',
        '^@/(.*)$': wallaby.projectCacheDir + '/src/$1',
      };

      wallaby.testFramework.configure(jestConfig);
    },

    testFramework: 'jest',
    debug: true
  }
};
