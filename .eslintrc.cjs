/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  ignorePatterns:['bin/*','dist/*','node_modules/*'],
  rules: {
    // 未使用的变量，警告
    'no-unused-vars': 'off', // 关闭原本的，使用 typescript-eslint 的
    '@typescript-eslint/no-unused-vars': 'warn',

    // 字符串使用单引号
     'quotes': ['error', 'single'],
  }
};