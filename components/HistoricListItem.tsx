import { Text, View, StyleSheet } from "react-native";
import moment from "moment";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect } from "react";

interface SensorProps {
  name: string;
  room: string;
  id: number;
  key: string;
}

interface HistoricProps {
  item: {
    id: number;
    begin_tp: FirebaseFirestoreTypes.Timestamp | Date;
    end_tp: FirebaseFirestoreTypes.Timestamp | Date;
    running: boolean;
    volume: number;
    duration: number;
  };
  index: number;
  sensor: SensorProps;
}

export default function HistoricListItem({
  item,
  index,
  sensor,
}: HistoricProps) {
  const { id, begin_tp, end_tp, volume, duration } = item;

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
      <View style={styles.item_text}>
        <Text style={[styles.item_text_title, { color: theme.dark_text }]}>
          {name}
        </Text>
        <Text style={[styles.item_text_info, { color: theme.secondary_text }]}>
          {room} • {volume}L • {formattedDuration()}
        </Text>
      </View>
      <Text style={[styles.item_date, { color: theme.dark_text }]}>
        {moment(begin_tp).format("LT")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  item_text: {
    gap: 5,
  },
  item_text_title: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 18,
  },
  item_text_info: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -0.4,
  },
  item_date: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
  },
});
