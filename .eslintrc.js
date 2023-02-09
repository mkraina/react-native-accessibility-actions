module.exports = {
  root: true,
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort', 'prettier'],
  extends: [
    'eslint:recommended',
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/no-var-requires': 'error',
      },
    },
  ],
  ignorePatterns: ['node_modules/'],
  rules: {
    // code readibility
    complexity: ['error', 25], // https://eslint.org/docs/rules/complexity
    'max-nested-callbacks': ['error', 4], // https://eslint.org/docs/rules/max-nested-callbacks
    'max-params': ['error', 5], // https://eslint.org/docs/rules/max-params
    'max-depth': ['error', 3], // https://eslint.org/docs/rules/max-depth
    'max-len': ['error', 200], // https://eslint.org/docs/rules/max-len
    'max-lines': ['error', 300], // https://eslint.org/docs/rules/max-lines
    'max-statements': ['error', 10], // https://eslint.org/docs/rules/max-statements
    'max-lines-per-function': ['error', 50], //https://eslint.org/docs/rules/max-lines-per-function
    'no-unneeded-ternary': ['error', { defaultAssignment: false }],
    'object-shorthand': ['error', 'always'],
    'no-useless-concat': 'error',
    'prefer-template': 'error',
    'no-mixed-operators': [
      'error',
      {
        groups: [
          ['+', '-', '%', '&&', '||'],
          ['*', '/', '%', '&&', '||'],
        ],
      },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'prettier/prettier': 'error',
    radix: ['error', 'as-needed'],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'], // Side effect imports.
          ['^react', '^@?\\w'], // Packages, packages starting "react" first
          ['^'], // Absolute imports
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Parent imports. Put `..` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./styled'], // Styled
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: '(useAccessibilityActions)',
      },
    ],
    '@typescript-eslint/no-var-requires': 'off',
  },
};
