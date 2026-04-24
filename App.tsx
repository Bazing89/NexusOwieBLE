import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FirmwareStyleIpPanel } from './components/FirmwareStyleIpPanel';
import { isSupabaseConfigured, supabase } from './lib/supabase';

export default function App() {
  const [userEmail, setUserEmail] = useState<string | null | undefined>(undefined);
  const [bleState, setBleState] = useState<string>('…');
  const [deviceIp, setDeviceIp] = useState<[number, number, number, number]>([192, 168, 4, 1]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setUserEmail(null);
      return;
    }
    void supabase.auth
      .getSession()
      .then(({ data: { session } }) => setUserEmail(session?.user?.email ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setBleState('Not available on web');
      return;
    }
    type BleMod = typeof import('react-native-ble-plx');
    let mod: BleMod;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      mod = require('react-native-ble-plx') as BleMod;
    } catch {
      setBleState('Native BLE module not loaded');
      return;
    }
    let manager: InstanceType<typeof mod.BleManager>;
    try {
      manager = new mod.BleManager();
    } catch {
      setBleState('Unusable in Expo Go — run a dev build (prebuild) for BLE');
      return;
    }
    const sub = manager.onStateChange((state) => {
      setBleState(String(state));
    }, true);
    return () => {
      sub.remove();
      void manager.destroy();
    };
  }, []);

  const gw = `${deviceIp[0]}.${deviceIp[1]}.${deviceIp[2]}.1`;
  const nm = '255.255.255.0';

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>NexusOwieBLE</Text>
        <Text style={styles.subtitle}>Same layout language as a small firmware IP screen — hook values to BLE when your service is ready.</Text>

        <FirmwareStyleIpPanel
          modeLabel="ADDR"
          padOctets={false}
          ip={deviceIp}
          gatewayText={gw}
          netmaskText={nm}
          onIpChange={(next) =>
            setDeviceIp([next[0], next[1], next[2], next[3]] as [number, number, number, number])
          }
        />

        <View style={styles.card}>
          <Text style={styles.label}>Bluetooth</Text>
          <Text style={styles.body}>Adapter: {bleState}</Text>
          {Platform.OS !== 'web' ? (
            <Text style={styles.hint}>Use a dev build (not Expo Go) to talk to your chip over BLE.</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Supabase</Text>
          {!isSupabaseConfigured ? (
            <Text style={styles.body}>
              Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in <Text style={styles.code}>.env</Text>
            </Text>
          ) : (
            <Text style={styles.body}>
              {userEmail === undefined
                ? '…'
                : userEmail
                  ? `Session: ${userEmail}`
                  : 'Signed out'}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  scroll: {
    padding: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#e7ecf3',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7c95',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1a222d',
    borderRadius: 12,
    padding: 16,
    marginTop: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b9cb3',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: '#e7ecf3',
  },
  hint: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    color: '#6b7c95',
  },
  code: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 14,
    color: '#9ecbff',
  },
});
