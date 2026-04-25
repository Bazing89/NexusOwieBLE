import type { ComponentProps } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** Placeholder metrics — replace with BLE / device data when your service is ready. */
const MOCK = {
  totalVoltage: '55.0',
  current: '0.0',
  bmsSoc: '87',
  overriddenSoc: '85',
  usedMah: '120',
  regen: '0',
  uptime: '0d 0h 12m',
  powerCycles: '3',
  temps: '22°C / 23°C',
  version: '1.0.0',
  cells: ['4.12', '4.10', '4.11', '4.09'],
} as const;

type Props = { subtitle?: string };

function MiniStat({
  icon,
  label,
  value,
  unit,
}: {
  icon: IconName;
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <View className="min-w-[47%] flex-1 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
      <View className="mb-2 flex-row items-center">
        <Ionicons name={icon} size={18} color="#a1a1aa" />
        <Text className="ml-2 text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</Text>
      </View>
      <View className="flex-row items-baseline">
        <Text className="text-2xl font-bold text-zinc-50">{value}</Text>
        {unit ? <Text className="ml-1 text-base font-medium text-zinc-400">{unit}</Text> : null}
      </View>
    </View>
  );
}

function RowItem({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-zinc-800/60 py-3 last:border-b-0">
      <Text className="text-sm text-zinc-500">{label}</Text>
      <Text className="max-w-[55%] text-right text-sm font-medium text-zinc-100">{value}</Text>
    </View>
  );
}

export function DataScreen({ subtitle }: Props) {
  const soc = Number(MOCK.overriddenSoc);
  const socWidth = Math.min(100, Math.max(0, soc));

  return (
    <ScrollView
      className="w-full flex-1"
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator
    >
      <View className="w-full gap-4">
      {subtitle ? (
        <View className="self-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5">
          <Text className="text-center text-xs font-medium text-zinc-400">{subtitle}</Text>
        </View>
      ) : null}

      {/* Hero SOC */}
      <View className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <Text className="text-center text-xs font-semibold uppercase tracking-widest text-zinc-500">
          State of charge
        </Text>
        <View className="flex-row items-baseline justify-center pt-1">
          <Text className="text-6xl font-extrabold text-white">{MOCK.overriddenSoc}</Text>
          <Text className="text-3xl text-zinc-500">%</Text>
        </View>
        <Text className="pb-3 text-center text-sm text-zinc-500">BMS reported {MOCK.bmsSoc}%</Text>
        <View className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <View className="h-full rounded-full bg-zinc-100" style={{ width: `${socWidth}%` }} />
        </View>
      </View>

      {/* Key metrics grid */}
      <View className="flex-row flex-wrap gap-3">
        <MiniStat
          icon="flash-outline"
          label="Pack voltage"
          value={MOCK.totalVoltage}
          unit="V"
        />
        <MiniStat icon="pulse-outline" label="Current" value={MOCK.current} unit="A" />
      </View>

      {/* Charge flow */}
      <View className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <Text className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Energy
        </Text>
        <View className="flex-row justify-between gap-2">
          <View className="flex-1 rounded-lg bg-zinc-950/80 p-3">
            <Text className="text-xs text-zinc-500">Used</Text>
            <Text className="text-lg font-semibold text-zinc-100">{MOCK.usedMah} mAh</Text>
          </View>
          <View className="flex-1 rounded-lg bg-zinc-950/80 p-3">
            <Text className="text-xs text-zinc-500">Regen</Text>
            <Text className="text-lg font-semibold text-zinc-100">{MOCK.regen} mAh</Text>
          </View>
        </View>
      </View>

      {/* Cell grid */}
      <View>
        <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Cell voltages
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {MOCK.cells.map((v, i) => (
            <View
              key={i}
              className="w-[23%] min-w-[22%] items-center rounded-lg border border-zinc-800 bg-zinc-900 py-2.5"
            >
              <Text className="text-base font-bold text-zinc-100">{v}v</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Details list */}
      <View className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4">
        <RowItem label="BMS reported SOC" value={`${MOCK.bmsSoc}%`} />
        <RowItem label="Uptime" value={MOCK.uptime} />
        <RowItem label="Power cycles" value={String(MOCK.powerCycles)} />
        <RowItem label="Battery / BMS temps" value={MOCK.temps} />
      </View>

      <Text className="text-center text-xs text-zinc-600">Nexus Owie v{MOCK.version}</Text>
    </View>
    </ScrollView>
  );
}
