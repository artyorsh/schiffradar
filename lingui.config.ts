import { defineConfig } from '@lingui/cli';

/**
 * @see https://lingui.dev/ref/conf
 */
export default defineConfig({
  locales: ['en', 'de', 'be', 'cs', 'es', 'fr', 'it', 'pl', 'uk'],
  catalogs: [
    {
      path: 'src/i18n/locales/{locale}',
      include: ['src'],
      exclude: [
        '**/node_modules/**',
        '**/*.spec.*',
      ],
    },
  ],
});
