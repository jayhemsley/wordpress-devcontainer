import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';

export default defineConfig([
  js.configs.recommended,
  eslintPluginImport.flatConfigs.recommended,
  {
    files: ['**/*.js'],
    ignores: ['**/*.min.js', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  eslintConfigPrettier
]);