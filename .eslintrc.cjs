module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'plugin:react/recommended',
  //extends: './node_modules/ts-standard/eslintrc.json',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: '[./tsconfig.json, ./.eslintrc.cjs]'
  },
  plugins: [
    '@typescript-eslint',
    'react'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/react-in-jsx-scope': 'off'
  }
}
