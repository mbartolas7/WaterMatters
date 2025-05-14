import { StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

interface RoomConsumptionProps {
  item: { label: string; value: number };
  index: number;
}

export default function RoomConsumptionListItem({
  item,
  index,
}: RoomConsumptionProps) {
  let { label, value } = item;

  value = Math.round(value * 100) / 100;

  const theme = useThemeColor();
  return (
    <View style={styles.item}>
      <Text style={[styles.item_text, { color: theme.dark_text }]}>
        {index + 1}. {label} :{" "}
        <Text style={styles.item_text_number}>{value}L</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {},
  item_text: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 18,
    letterSpacing: -0.4,
  },
  item_text_number: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
  },
});
