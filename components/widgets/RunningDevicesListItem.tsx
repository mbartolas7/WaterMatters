import { useThemeColor } from "@/hooks/useThemeColor";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { StyleSheet, Text, View } from "react-native";

interface SensorProps {
  name: string;
  room: string;
  id: number;
  key: string;
}

interface UseProps {
  begin_tp: FirebaseFirestoreTypes.Timestamp | Date;
  end_tp: FirebaseFirestoreTypes.Timestamp | Date;
  duration: number;
  id: number;
  running: boolean;
  volume: number;
  key: string;
}

interface RunningDevicesListItemProps {
  item: UseProps;
  key: number;
  sensor: SensorProps;
}

export default function RunningDevicesListItem(
  props: RunningDevicesListItemProps
) {
  const { item, sensor } = props;

  const theme = useThemeColor();

  if (sensor == undefined) return <></>;

  const { room, name } = sensor;

  return (
    <View style={styles.item}>
      <Text style={[styles.item_text, { color: theme.dark_text }]}>{name}</Text>
      <Text style={[styles.item_secondary, { color: theme.secondary_text }]}>
        {room}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: 2,
  },
  item_text: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -0.4,
  },
  item_secondary: {
    fontFamily: "Figtree-Regular",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.4,
  },
});
