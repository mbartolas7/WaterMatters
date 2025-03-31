import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { PieChart } from "react-native-gifted-charts";

import moment from "moment";
import "moment/locale/fr"; // Importer la locale française

interface ChallengeProps {
  title: string;
  description: string;
  progression: number;
  success_date?: EpochTimeStamp;
  key: number;
}

export default function ChallengeListItem(props: ChallengeProps) {
  const { title, description, progression, success_date } = props;

  const theme = useThemeColor();

  return (
    <View
      style={[
        styles.item,
        { backgroundColor: theme.light_text, borderColor: theme.stroke },
      ]}
    >
      <View style={styles.item_progression}>
        {progression == 100 ? (
          <View
            style={[
              styles.item_progression_100,
              { backgroundColor: theme.tint, borderColor: theme.stroke },
            ]}
          >
            <Check size={18} strokeWidth={2.25} color={theme.light_text} />
          </View>
        ) : (
          <PieChart
            donut
            data={[
              { value: progression, color: theme.tint },
              { value: 100 - progression, color: theme.light_text },
            ]}
            radius={15}
            strokeWidth={1}
            strokeColor={theme.stroke}
            innerCircleBorderColor={theme.stroke}
            innerCircleBorderWidth={1}
            innerRadius={9}
          />
        )}
      </View>
      <View style={styles.item_text}>
        <View style={styles.item_text_header}>
          <Text
            numberOfLines={2}
            style={[styles.item_text_header_title, { color: theme.dark_text }]}
          >
            {title}
          </Text>
          {success_date && (
            <Text
              style={[styles.item_text_header_date, { color: theme.dark_text }]}
            >
              {moment(success_date).locale("fr").format("DD/MM/YY")}
            </Text>
          )}
        </View>
        <Text
          style={[
            styles.item_text_description,
            { color: theme.secondary_text },
          ]}
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    flexDirection: "row",
    gap: 20,
  },
  item_progression: {
    alignSelf: "center",
  },
  item_progression_100: {
    borderWidth: 1,
    borderRadius: 20,
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  item_text: {
    flex: 1,
    gap: 5,
  },
  item_text_header: {
    gap: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item_text_header_title: {
    flex: 1,
    fontFamily: "Figtree-SemiBold",
    fontSize: 18,
    letterSpacing: 0,
  },
  item_text_header_date: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
  },
  item_text_description: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    letterSpacing: -0.4,
  },
});
