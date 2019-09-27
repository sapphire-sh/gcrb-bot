module.exports = {
	preset: 'ts-jest',
	testEnvironment: "node",
	globals: {
		"ts-jest": {
			"isolatedModules": true,
		},
	},
	rootDir: "./src",
	collectCoverageFrom: [
		"**/*.{js,ts}"
	],
};
