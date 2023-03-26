module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    // "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    // 'prettier/prettier': [
		// 	'error',
		// 	{
		// 		singleQuote: true,
		// 		semi: true,
		// 		useTabs: true,
		// 		tabWidth: 2,
		// 		trailingComma: 'all',
		// 		printWidth: 80,
		// 		bracketSpacing: true,
		// 		arrowParens: 'avoid',
		// 	},
		// ],
    // semi: "false",
    // "comma-dangle": "off",
    // 'no-new': 'off',
    // indent: ['error', 2],
    // 'import/extensions': 'off',

    // 'vue/multi-words-component-names': ["error", {
    //   'ignores': []
    // }],
  },

};
