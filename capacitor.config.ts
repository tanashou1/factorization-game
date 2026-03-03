import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tanashou1.factorizationgame',
  appName: '因数分解ゲーム',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
