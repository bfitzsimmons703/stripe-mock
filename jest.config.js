/**
 * Jest support for ESM is still experimental, so node_modules that use ESM break our current config.
 * To overcome this, we can include those specific modules in the `transformIgnorePatterns` config property.
 * A little counter-intuitive given the name of the property, but it allows the transpiling of those modules for Jest to understand.
 *
 * From [Jest](https://jestjs.io/docs/configuration#transformignorepatterns-arraystring):
 * """
 * Sometimes it happens (especially in React Native or TypeScript projects) that 3rd party modules are published as untranspiled code.
 * Since all files inside node_modules are not transformed by default,
 * Jest will not understand the code in these modules, resulting in syntax errors.
 * To overcome this, you may use transformIgnorePatterns to allow transpiling such modules.
 * """
 */
const esModules = ['nanoid'].join('|');

module.exports = {
	testMatch: ['**/*.test.{js,ts}'],
	transform: {
		'^.+\\.[jt]s$': ['@swc/jest'],
	},
	transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^tests/(.*)$': '<rootDir>/tests/$1',

		'^__mocks__/(.*)$': '<rootDir>/__mocks__/$1',
	},
	clearMocks: true,
	collectCoverage: false,
	testPathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/.esbuild/',
	],
	globalSetup: '<rootDir>/tests/global-setup.ts', // Executed once before all tests
};
