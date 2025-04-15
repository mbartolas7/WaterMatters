import { Text, View, StyleSheet } from "react-native";
import moment from "moment";

interface HistoricProps {
  item: {
    id: number;
    begin_tp: Date;
    end_tp: Date;
    running: boolean;
    volume: number;
    duration: number;
  };
  index: number;
}

export default function HistoricListItem({ item, index }: HistoricProps) {
  const { id, begin_tp, end_tp, volume } = item;
  return (
    <View style={styles.item}>
      <Text style={styles.item_title}>{id}</Text>
      <Text style={styles.item_date}>
        {moment(begin_tp).format("DD/MM/YY")}
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

  item_title: {},
  item_date: {},
});
