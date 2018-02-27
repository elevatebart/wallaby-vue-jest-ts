const babelOptions = { sourceMap: true, plugins: ["transform-es2015-modules-commonjs"], presets: ['babel-preset-jest'] };

module.exports = function (wallaby) {
    return {
        files: [
            { pattern: 'tsconfig.json', instrument: false },
            { pattern: 'test/unit/jest.conf.js', instrument: false },
            { pattern: 'src/**/*.*', load: false },
        ],

        compilers: {
            '**/*.js': wallaby.compilers.babel(),
            '**/*.vue': require('wallaby-vue-compiler')(wallaby.compilers.babel({})),
            "**/*.ts?(x)": wallaby.compilers.typeScript({
                module: "commonjs"
            }),
        },

        preprocessors: {
            "**/*.js?(x)": file => require("babel-core").transform(file.content, babelOptions),
        },

        tests: [
            { pattern: 'test/unit/**/*.spec.ts', load: false }
        ],

        env: {
            type: 'node',
            runner: 'node'
        },

        testFramework: 'jest',
        setup: function () {
            const jestConfig = require('./test/unit/jest.conf');
            jestConfig.moduleNameMapper = {
                "^@/(.*)$": wallaby.projectCacheDir + "/src/$1"
            };
            wallaby.testFramework.configure(jestConfig);
        },
        debug: true
    }
}