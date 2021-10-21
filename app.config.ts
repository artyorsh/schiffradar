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

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.APP_NAME,
  slug: 'schiffradar',
  newArchEnabled: true,
  icon: './assets/images/ic-launcher.png',
  android: {
    ...config.android,
    edgeToEdgeEnabled: true,
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
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  extra: {
    eas: {
      projectId,
    },
  },
  updates: {
    url: `https://u.expo.dev/${projectId}`,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  orientation: 'portrait',
  plugins: [
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    [
      'expo-font',
      {
        fonts: fontFamilies.map(f => {
          const [family, weightStyle] = f.split('/');
          const dirName: string = `${family.toLowerCase()}/${weightStyle}`;
          const fileName: string = `${family}_${weightStyle}.ttf`;

          return `node_modules/@expo-google-fonts/${dirName}/${fileName}`;
        }),
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F5F5F5', // uilib > colors.background
        image: './assets/images/ic-splash.png', // no-image
        dark: {
          backgroundColor: '#212121',
          image: './assets/images/ic-splash.png',
        },
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Schiffradar needs access to your location to show your position on the map.',
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
      },
    ],
    'expo-secure-store',
    'expo-web-browser',
    [
      '@rnmapbox/maps',
      {
        RNMapboxMapsDownloadToken: process.env.EXPO_PUBLIC_MAPBOX_RNMapboxMapsDownloadToken,
      },
    ],
  ],
});
