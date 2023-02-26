module.exports = {
  root: true,
  env: {
    'vue/setup-compiler-macros': true,
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  plugins: [],
  rules: {
    'no-undef': 0,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    semi: 0,
  },
  globals: {
    uni: true,
    wx: true,
  },
}
