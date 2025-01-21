module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'jsx-a11y'
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // Possible Errors
    'no-console': 'warn',
    'no-debugger': 'warn',

    // Best Practices
    'eqeqeq': ['error', 'always'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],

    // React Rules
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // TypeScript Rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off', 
    '@typescript-eslint/no-var-requires': 'off',

    // Accessibility Rules
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/aria-role': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn'
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off'
      }
    }
  ],
  globals: {
    'process': true,
    'require': true,
    'module': true,
    '__dirname': true,
    'setInterval': true
  },
  ignorePatterns: [
    'node_modules/', 
    'dist/', 
    'build/', 
    '*.config.js', 
    '*.config.ts'
  ]
};
