import { ConfigContext, ExpoConfig } from 'expo/config';

const projectId: string = 'a37a5db1-0403-447f-bebb-4be9d07f9659';

/**
 * Font families as they stored in node_modules/@expo-google-fonts dir.
 */
const fontFamilies: string[] = [
  'Inter/300Light',
  'Inter/400Regular',
  'Inter/500Medium',
  'Inter/600SemiBold',
];

/**
 * Native localization files stored in ./src/i18n/locales (prefixed with 'native-').
 * @see https://docs.expo.dev/guides/localization/#translating-app-metadata
 */
const locales: string[] = [
  'en',
  'de',
];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.APP_NAME,
  slug: 'schiffradar',
  icon: './assets/images/ic-launcher.png',
  android: {
    ...config.android,
    package: process.env.BUNDLE_IDENTIFIER,
    adaptiveIcon: {
      backgroundImage: './assets/images/ic-launcher-background.png',
      monochromeImage: './assets/images/ic-launcher-foreground.png',
      foregroundImage: './assets/images/ic-launcher-foreground.png',
    },
  },
  ios: {
    ...config.ios,
    bundleIdentifier: process.env.BUNDLE_IDENTIFIER,
    infoPlist: {
      'CFBundleAllowMixedLocalizations': true,
      'ITSAppUsesNonExemptEncryption': false,
    },
  },
  experiments: {
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId,
    },
  },
  locales: locales
    .reduce((acc, locale) => ({ ...acc, [locale]: `./src/i18n/locales/native-${locale}.json` }), {}),
  updates: {
    url: `https://u.expo.dev/${projectId}`,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  orientation: 'portrait',
  plugins: [
    'expo-image',
    [
      'expo-build-properties',
      {
        ios: {
          buildReactNativeFromSource: true,
          useFrameworks: 'static',
        },
      },
    ],
    [
      'expo-font',
      {
        'fonts': fontFamilies.map(f => {
          const [family, weightStyle] = f.split('/');
          const dirName: string = `${family.toLowerCase()}/${weightStyle}`;
          const fileName: string = `${family}_${weightStyle}.ttf`;

          return `node_modules/@expo-google-fonts/${dirName}/${fileName}`;
        }),
      },
    ],
    'expo-localization',
    [
      'expo-location',
      {
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
      },
    ],
    [
      'expo-splash-screen',
      {
        'backgroundColor': '#F5F5F5', // uilib > colors.background
        'image': './assets/images/ic-splash.png', // no-image
        'dark': {
          'backgroundColor': '#212121',
          'image': './assets/images/ic-splash.png',
        },
      },
    ],
    'expo-secure-store',
    'expo-web-browser',
    [
      '@sentry/react-native/expo',
      {
        'url': 'https://sentry.io/',
        'project': process.env.SENTRY_PROJECT,
        'organization': process.env.SENTRY_ORGANIZATION,
      },
    ],
    [
      '@rnmapbox/maps',
      {
        RNMapboxMapsDownloadToken: process.env.EXPO_PUBLIC_MAPBOX_RNMapboxMapsDownloadToken,
      },
    ],
  ],
});
