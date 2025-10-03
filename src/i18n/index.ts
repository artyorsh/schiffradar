import { FC, ReactNode } from 'react';
import { ExpoDevMenuItem } from 'expo-dev-menu';
import { getLocales } from 'expo-localization';
import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { ILogService } from '@/log';

import { ITranslationProvider, LinguiI18nService } from './lingui-i18n.service';
import { LocalTranslationProvider } from './local-translation-provider';

export type ISupportedLocale =
  | 'en'
  | 'de'
  | 'be'
  | 'cs'
  | 'es'
  | 'fr'
  | 'it'
  | 'pl'
  | 'uk';

export interface II18nService {
  getCurrentLocale(): ISupportedLocale;
  setLocale(locale: string): void;
  getProviderComponent(): FC<{ children: ReactNode }>;
  getDevMenuItems(): ExpoDevMenuItem[];
}

export const I18nModule = new ContainerModule(({ bind }) => {
  bind(AppModule.I18N)
    .toDynamicValue(context => createI18nService(context))
    .inSingletonScope();
});

const createI18nService = (context: ResolutionContext): II18nService => {
  const [systemLocale] = getLocales();

  return new LinguiI18nService({
    locale: systemLocale.languageCode,
    translationProvider: createTranslationProvider(context),
  });
};

const createTranslationProvider = (context: ResolutionContext): ITranslationProvider => {
  const logService: ILogService = context.get(AppModule.LOG);

  return new LocalTranslationProvider({
    logger: logService.createLogger(LocalTranslationProvider.name),
    locales: {
      en: () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@formatjs/intl-pluralrules/locale-data/en');

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('./locales/en.po').messages;
      },
      de: () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@formatjs/intl-pluralrules/locale-data/de');

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('./locales/de.po').messages;
      },
      be: () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@formatjs/intl-pluralrules/locale-data/be');

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('./locales/be.po').messages;
      },
      cs: () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@formatjs/intl-pluralrules/locale-data/cs');

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('./locales/cs.po').messages;
      },
      es: () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@formatjs/intl-pluralrules/locale-data/es');

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('./locales/es.po').messages;
      },
      fr: () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@formatjs/intl-pluralrules/locale-data/fr');

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('./locales/fr.po').messages;
      },
      it: () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@formatjs/intl-pluralrules/locale-data/it');

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('./locales/it.po').messages;
      },
      pl: () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@formatjs/intl-pluralrules/locale-data/pl');

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('./locales/pl.po').messages;
      },
      uk: () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@formatjs/intl-pluralrules/locale-data/uk');

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('./locales/uk.po').messages;
      },
    },
  });
};
