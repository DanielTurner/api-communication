// Minimal eslint.config.js without external configs
import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '*.min.js'],
  },

  {
    files: ['**/*.js'],
    plugins: {
      jsdoc,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es6,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    rules: {
      ...jsdoc.configs['recommended'].rules,  // or 'stylistic' / 'strict'
      // Add your own preferred rules here
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
    },
  },
];