import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.apptask.app',
  appName: 'AppTask',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
