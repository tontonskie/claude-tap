import jslint from '@eslint/js'
import prettierConfig from 'eslint-plugin-prettier/recommended'
import jestlint from 'eslint-plugin-jest'
import tslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  {
    ignores: ['eslint.config.mjs', 'dist', 'coverage']
  },
  jslint.configs.recommended,
  tslint.configs.recommended,
  jestlint.configs['flat/recommended'],
  prettierConfig,
  {
    languageOptions: {
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    rules: {
      eqeqeq: ['error', 'smart'],
      'no-duplicate-imports': 'error',
      'jest/prefer-hooks-on-top': 'error',
      'jest/consistent-test-it': ['error', { fn: 'test' }],
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
)
