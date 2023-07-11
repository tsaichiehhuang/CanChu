module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  plugins: ['babel', 'jsx-a11y', 'proposal'],
  parser: '@babel/eslint-parser',
  extends: ['airbnb-base', 'plugin:jsx-a11y/recommended', 'next', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'proposal/class-property-semi': ['error', 'never'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-single'],
    semi: ['error', 'always'],
    'semi-spacing': ['error'],
    'comma-dangle': ['error', 'never'],
    'comma-spacing': 'error',
    'key-spacing': 'error',
    'arrow-spacing': 'error',
    'space-infix-ops': 'error',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    camelcase: 'off',
    'new-cap': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'no-unused-vars': 'off',
    'no-unreachable': 'error',
    'computed-property-spacing': ['error', 'never'],
    curly: ['error', 'all'],
    'no-unneeded-ternary': 'error'
  }
};
