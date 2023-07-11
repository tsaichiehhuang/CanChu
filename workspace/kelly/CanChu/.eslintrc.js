module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'airbnb-base',
  overrides: [],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'proposal/class-property-semi': ['error', 'never'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-single'],
    semi: ['error', 'never'],
    'semi-spacing': ['error'],
    'comma-dangle': ['error', 'never'],
    'comma-spacing': 'error',
    'key-spacing': 'error',
    'arrow-spacing': 'error',
    'space-infix-ops': 'error',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    camelcase: 'error',
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
}
