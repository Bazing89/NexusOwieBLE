import { StyleSheet, View } from 'react-native';
import { OwieButton } from '../components/owie/OwieButton';
import { OwieHeader } from '../components/owie/OwieHeader';
import type { OwieScreen } from './types';

type Props = { go: (s: OwieScreen) => void };

export function DevSettingsScreen({ go }: Props) {
  return (
    <>
      <OwieHeader title="Owie Developer Settings" subtitle="(NexusOwie-BLE)" />
      <View style={styles.p} />
      <OwieButton onPress={() => go('wifi')}>Wifi Configuration</OwieButton>
      <View style={styles.p} />
      <OwieButton onPress={() => go('monitor')}>Monitor BMS data</OwieButton>
      <View style={styles.p} />
      <OwieButton onPress={() => go('settings')}>Back</OwieButton>
    </>
  );
}

const styles = StyleSheet.create({ p: { height: 8 } });
