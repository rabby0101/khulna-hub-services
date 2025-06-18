
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const initializeCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    // Configure status bar for native apps
    await StatusBar.setStyle({ style: Style.Default });
    
    // Hide splash screen after app loads
    await SplashScreen.hide();
  }
};

export const isNative = () => Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform();
