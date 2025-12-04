module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['next', 'next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-console': 'warn'
  },
  overrides: [
    {
      files: ['scripts/**/*'],
      rules: {
        'import/extensions': 'off',
        'import/no-unresolved': 'off'
      }
    }
  ]
}
