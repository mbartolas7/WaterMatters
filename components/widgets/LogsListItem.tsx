import { useThemeColor } from "@/hooks/useThemeColor";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { StyleSheet, Text, View } from "react-native";

interface SensorProps {
  name: string;
  room: string;
  id?: number;
  key?: string;
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

interface LogsListItemProps {
  item: UseProps;
  key: number;
  sensor: SensorProps;
}

export default function LogsListItem(props: LogsListItemProps) {
  const { sensor, item } = props;
  const { duration, volume } = item;

  const theme = useThemeColor();

  const formattedDuration = () => {
    let text = `${Math.floor(duration / 60)}m`;
    if (duration % 60) {
      text += ` ${duration % 60}s`;
    }
    return text;
  };

  if (sensor == undefined) return <></>;

  const { name, room } = sensor;

  return (
    <View style={styles.item}>
      <Text style={[styles.item_text, { color: theme.dark_text }]}>
        {name} • {formattedDuration()} • {volume}L
      </Text>
      <Text style={[styles.item_room, { color: theme.secondary_text }]}>
        {room}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item_text: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    letterSpacing: -0.4,
    lineHeight: 20,
  },
  item_room: {
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    lineHeight: 20,
    letterSpacing: -0.4,
  },
});
