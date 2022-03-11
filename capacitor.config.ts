import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rajan.app',
  appName: 'MobixDemo',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '.....apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
