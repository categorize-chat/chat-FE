// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  // Global ignores - 전역적으로 무시할 파일들
  {
    ignores: [
      '**/dist/**',
      '**/.eslintrc.cjs',
      '**/node_modules/**',
      '**/coverage/**',
      '**/build/**',
      '**/*.min.js',
      '**/.git/**',
    ],
  },

  // ESLint 기본 추천 설정
  eslint.configs.recommended,

  // TypeScript ESLint 추천 설정
  ...tseslint.configs.recommended,

  // 파일별 세부 설정
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // 필요한 경우 여기에 추가 규칙 설정
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
    },
  },
];
