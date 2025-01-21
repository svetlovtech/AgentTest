export default {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'jsx-a11y',
    'import'
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      }
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

    // Module Rules
    'import/order': ['warn', {
      groups: [
        'builtin', 
        'external', 
        'internal', 
        ['parent', 'sibling'], 
        'index'
      ],
      'newlines-between': 'always'
    }],
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/default': 'error',
    'import/export': 'error',

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

    // Error Handling
    'no-throw-literal': 'error',
    'no-return-await': 'warn',

    // Performance
    'no-constant-condition': 'warn',

    // Complexity
    'max-depth': ['warn', 4],
    'max-lines-per-function': ['warn', 50],
    'complexity': ['warn', 10]
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
