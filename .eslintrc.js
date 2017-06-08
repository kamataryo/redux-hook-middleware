module.exports = {
  'env': {
    'browser'  : true,
    'commonjs' : true,
    'es6'      : true,
    'mocha'    : true,
    'node'     : true
  },
  'plugins': [
    'import',
  ],
  'extends': [
    'eslint:recommended',
    'plugin:import/errors',
  ],
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 2017,
    'sourceType': 'module',
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': false
    }
  },
  'rules': {
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'jsx-quotes': ['error', 'prefer-double'],
    'valid-jsdoc': ['error'],
    'key-spacing': ['off'],
    'keyword-spacing': ['error'],
    'linebreak-style': ['error', 'unix'],
    'no-dupe-args': ['error'],
    'no-console': ['warn'],
    'no-const-assign': ['error'],
    'no-unused-vars': ['warn'],
    'object-curly-spacing': ['error', 'always'],
    'require-jsdoc': ['error', {
      'require': {
        'ArrowFunctionExpression': true,
        'ClassDeclaration': true,
        'FunctionDeclaration': true,
        'MethodDefinition': true
      }
    }],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'spaced-comment': [
      'error',
      'always', {
        'line': {
          'markers': ['/'],
          'exceptions': ['-', '+']
        },
        'block': {
          'markers': ['!'],
          'exceptions': ['*'],
          'balanced': true
        }
      }
    ],
    'space-unary-ops': ['error'],
    'space-infix-ops': ['error', { 'int32Hint': false }],
    'sort-imports': ['off'],
  }
}
