import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'sansuibeefbrisket',
  slug: 'sansuibeefbrisket',
  version: '1.0.2',
  scheme: 'sansuibeefbrisket',
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-localization',
    [
      '@stripe/stripe-react-native',
      {
        merchantIdentifier: 'merchant.com.sansuibeefbrisket',
        enableGooglePay: false,
      },
    ],
    '@react-native-google-signin/google-signin',
    [
      'react-native-fbsdk-next',
      {
        appID: process.env.FB_APP_ID,
        clientToken: process.env.FB_CLIENT_TOKEN,
        displayName: '山水清湯腩',
        scheme: 'fb' + process.env.FB_APP_ID,
        advertiserIDCollectionEnabled: false,
        autoLogAppEventsEnabled: false,
        isAutoInitEnabled: true,
      },
    ],
    [
      'expo-calendar',
      {
        calendarPermission: '允許 $(PRODUCT_NAME) 存取以加入預約',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: '允許 $(PRODUCT_NAME) 存取以掃描QRCode或用以上傳圖片',
        microphonePermission: '允許 $(PRODUCT_NAME) 存取以掃描QRCode或用以上傳圖片',
        recordAudioAndroid: true,
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: '允許存取以上傳商品評價圖片影片及頭像',
      },
    ],
    'expo-video',
    '@react-native-firebase/app',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    ['expo-apple-authentication'],
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    usesAppleSignIn: true,
    entitlements: {
      'aps-environment': 'production',
    },
    infoPlist: {
      NSRemindersFullAccessUsageDescription: '允許 $(PRODUCT_NAME) 存取以加入預約',
      NSRemindersUsageDescription: '允許存取以加入預約',
      NSCameraUsageDescription: '允許存取以掃描QRCode或用以上傳圖片',
      NSLocationWhenInUseUsageDescription: '允許存取定位尋找付近店鋪',
      NSMicrophoneUsageDescription: '允許存取以上傳商品評價圖片影片及頭像',
      NSPhotoLibraryAddUsageDescription: '允許存取以上傳商品評價圖片及頭像',
      NSPhotoLibraryUsageDescription: '允許存取以上傳商品評價圖片及頭像',
      NSUserTrackingUsageDescription: '允許上傳報錯以改善應用程式質素',
    },
    bundleIdentifier: 'com.sansuibeefbrisket.v1',
    config: {
      googleSignIn: {
        reservedClientId:
          'com.googleusercontent.apps.1096191344260-rccbu6aimk88odjiv0f647jg7ddmg0as',
      },
    },
    googleServicesFile: './GoogleService-Info.plist',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.sansuibeefbrisket.v1',
    googleServicesFile: './google-services.json',
  },
});
