module.exports = {
  extends: ['universe/native'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    eqeqeq: ['warn', 'always'],
    'no-case-declarations': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'node/handle-callback-err': 'warn',
  },
  overrides: [
    {
      files: ['e2e/**/*.js'],
      globals: {
        waitForElement: 'readonly',
        navigateToTab: 'readonly',
      },
    },
  ],
  ignorePatterns: [
    '**/assets/**',
    '**/ios/**',
    '**/android/**',
    'node_modules',
    '.expo',
    'dist',
    'web-build',
    '.tamagui',
    'coverage',
    'artifacts',
  ],
};
