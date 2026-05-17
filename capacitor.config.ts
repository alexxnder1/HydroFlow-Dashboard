import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hydroflow',
  appName: 'HydroFlow Irrigation Systems',
  webDir: './build',
  "server": {
    "androidScheme": "http"
  }
};

export default config;
