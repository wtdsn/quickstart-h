/* eslint-env node */
module.exports = {
  extends: [
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  ignorePatterns: ['bin/*', 'dist/*', 'node_modules/*'],
  rules: {
    // 未使用的变量，警告
    'no-unused-vars': 'off', // 关闭原本的，使用 typescript-eslint 的
    '@typescript-eslint/no-unused-vars': 'warn',

    // 字符串使用单引号
    quotes: ['error', 'single'],

    // prettier 配置
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],

    '@typescript-eslint/no-explicit-any': 'off',
  },
};
