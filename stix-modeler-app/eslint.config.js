import eslint from '@eslint/js';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  globalIgnores([
    "config/*",
    "dist/*",
    "node_modules/*",
  ]),
  {
    languageOptions: {
      globals: {
        ...globals.browser
      },
    },
  }
);