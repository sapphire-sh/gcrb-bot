module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			'isolatedModules': true,
		},
		'__test': true,
	},
    moduleNameMapper: {
      '~/(.*)': '<rootDir>/src/$1'
    },
	rootDir: '.',
	collectCoverageFrom: [
		'src/**/*.{js,ts}'
	],
};
