export default {
  expo: {
    name: 'doovo',
    slug: 'doovo',
    version: '1.0.0',
    scheme: 'doovo',
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/icon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-dev-launcher',
        {
          launchMode: 'most-recent',
        },
      ],
      ['expo-web-browser'],
    ],
    experimental: {
      fabric: true,
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: 'portrait',
    icon: './assets/icon.png',
    newArchEnabled: true,
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#FF6400',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.doovo',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#FF6400',
      },
      package: 'com.anonymous.doovo',
    },
    extra: {
      router: {
        origin: false,
      },
    },
    owner: 'taydrey',
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
};
