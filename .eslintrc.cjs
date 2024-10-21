// eslint-disable-next-line no-undef
module.exports = {
  env: { browser: true, jest: true },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier', 'plugin:react/jsx-runtime'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        arrowParens: 'always',
        printWidth: 120,
        trailingComma: 'es5',
        tabWidth: 2,
        useTabs: false,
      },
    ],
  },
};
