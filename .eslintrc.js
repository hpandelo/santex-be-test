module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'standard-with-typescript',
    "prettier",
    "plugin:@typescript-eslint/eslint-recommended"
  ],
  "plugins": [
    "@typescript-eslint"
    // "prettier"
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // "prettier/prettier": ["error", { "endOfLine": "lf" }],
    'no-return-await': 'off',
    'no-console': 'warn',
    '@typescript-eslint/comma-dangle': [
      'warn',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    quotes: 'off',
    '@typescript-eslint/quotes': ['warn', 'single'],
    '@typescript-eslint/no-explicit-any': 'off',
    // "@typescript-eslint/explicit-function-return-type": "warn",
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/explicit-module-boundary-access': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    'no-loop-func': 'off',
    '@typescript-eslint/no-loop-func': 'error',
  },
}
