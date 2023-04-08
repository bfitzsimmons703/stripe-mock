module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	plugins: ['eslint-plugin-tsdoc', 'import', 'jest', 'prettier', '@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:import/typescript',
		'plugin:@typescript-eslint/recommended',

		// Including this rule set is recommended by typescript-eslint.
		// See https://typescript-eslint.io/linting/configs#recommended-requiring-type-checking.
		// This requires two additional options be set in `parserOptions`.
		'plugin:@typescript-eslint/recommended-requiring-type-checking',

		// This allows for `prettier` to overwrite any eslint formatting rules so we don't end up with conflicting rules. See https://github.com/prettier/eslint-config-prettier.
		// This should also be the last item in the `extends` array.
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
		// The following two options are required for the `extends` value of plugin:@typescript-eslint/recommended-requiring-type-checking.
		// See https://typescript-eslint.io/linting/typed-linting/.
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json'],
	},
	root: true,
	rules: {
		'arrow-parens': ['error', 'always'],
		'prefer-const': ['error'],
		// Disallow var-type variable declarations. This, combined with the prefer-const rule, will let
		// eslint automatically replace vars with either `let`s or `const`s as appropriate.
		'no-var': 'error',
		'prettier/prettier': 'warn',
		'object-shorthand': [
			'error',
			'always',
			{
				// This prefers the shorthand object method syntax over arrow functions when they use an
				// explicit return statement. This normalizes methods in most cases, provided they don't
				// interact with `this` and aren't expression-derived arrow functions.
				avoidExplicitReturnArrows: true,
			},
		],
		'no-mixed-operators': ['error', { groups: [['&&', '||']] }],
		'linebreak-style': ['error', 'unix'],
		"semi": "off",
		"@typescript-eslint/semi": ["error"],
		'no-use-before-define': ['error', 'nofunc'],
		quotes: [
			'error',
			'single',
			{
				// Let people use strings like "don't worry about single quotes".
				avoidEscape: true,
			},
		],
		// Enforce our whitespace styles around keywords.
		'keyword-spacing': [
			'error',
			{
				overrides: {
					function: {
						after: false,
					},
				},
			},
		],
		'no-return-await': ['error'],
		'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],

		'no-console': ['error'],

		// Error when we use parseInt incorrectly or without the radix parameter.
		radix: ['error', 'always'],

		// Only allow throwing Error objects.
		'no-throw-literal': ['error'],

		// Require consistent return values (either always or never specifying values) so we don't
		// rely on implicit returns when return booleans or undefined.
		'consistent-return': ['error', { treatUndefinedAsUnspecified: true }],
		'eol-last': ['error', 'always'],

		// Also sort the named imports _within_ an import statement.
		'sort-imports': ['warn', { ignoreDeclarationSort: true }],

		// Ensure that we use curly braces for multi-line statements and that if one statement uses
		// curly braces, they all do.
		curly: ['warn', 'multi-line', 'consistent'],

		// Show warnings for all `tsdoc` rules
		"tsdoc/syntax": "warn"
	},
	overrides: [
		// For testing files
		{
			files: ['**/**/*.test.js'],
			extends: ['plugin:jest/recommended', 'plugin:jest/style'],
		},
		// Allow `console.log` statements in scripts.
		{
			files: ['scripts/**/*.[jt]s'],
			rules: {
				'no-console': 'off',
			},
		},
	],
};
