import './global.css';

import { useCallback, useEffect, useState } from 'react';
import { Platform, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppShell } from './components/AppShell';
import { DataHeader } from './components/DataHeader';
import { AppSettingsScreen } from './screens/AppSettingsScreen';
import { BleConnectScreen } from './screens/BleConnectScreen';
import { DataScreen } from './screens/DataScreen';

export default function App() {
  const { height, width } = useWindowDimensions();
  const [connected, setConnected] = useState(false);
  const [device, setDevice] = useState<{ id: string; name: string | null } | null>(null);
  const [appSettings, setAppSettings] = useState(false);

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    for (const el of [document.documentElement, document.body, document.getElementById('root')]) {
      if (!el) continue;
      el.style.height = '100%';
      el.style.margin = '0';
    }
  }, []);

  const handleBleConnected = useCallback((d: { id: string; name: string | null }) => {
    setDevice(d);
    setConnected(true);
  }, []);

  const handleDemo = useCallback(() => {
    setDevice({ id: 'demo', name: 'Demo device' });
    setConnected(true);
  }, []);

  const backToConnection = useCallback(() => {
    setConnected(false);
    setDevice(null);
    setAppSettings(false);
  }, []);

  const handleDisconnect = useCallback(() => {
    backToConnection();
  }, [backToConnection]);

  const webFill =
    Platform.OS === 'web'
      ? { minHeight: height, minWidth: width, flex: 1 as const }
      : { flex: 1 as const };

  if (!connected) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar style="light" />
        <View
          className="w-full items-center"
          style={[
            { paddingVertical: 20, paddingHorizontal: 12 },
            webFill,
          ]}
        >
          <AppShell>
            <BleConnectScreen onConnected={handleBleConnected} onDemo={handleDemo} />
          </AppShell>
        </View>
      </SafeAreaView>
    );
  }

  if (appSettings) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar style="light" />
        <View
          className="w-full"
          style={[
            { paddingVertical: 12, paddingHorizontal: 12 },
            webFill,
          ]}
        >
          <AppShell>
            <AppSettingsScreen onBack={() => setAppSettings(false)} onDisconnect={handleDisconnect} />
          </AppShell>
        </View>
      </SafeAreaView>
    );
  }

  const displayName = device?.name || 'Nexus Owie';
  const subtitle = device ? `Live · ${device.id === 'demo' ? 'demo' : 'device'}` : undefined;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style="light" />
      <View
        className="w-full items-center"
        style={[
          { paddingVertical: 16, paddingHorizontal: 12 },
          webFill,
        ]}
      >
        <AppShell>
          <DataHeader
            title={displayName}
            onBack={backToConnection}
            onSettingsPress={() => setAppSettings(true)}
          />
          <DataScreen subtitle={subtitle} />
        </AppShell>
      </View>
    </SafeAreaView>
  );
}
