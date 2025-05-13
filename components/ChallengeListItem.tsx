import { useThemeColor } from "@/hooks/useThemeColor";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Check, Flame } from "lucide-react-native";
import { PieChart } from "react-native-gifted-charts";

import moment from "moment";
import { useEffect, useState } from "react";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import ButtonContainer from "./button/ButtonContainer";

interface ChallengeProps {
  item: {
    success?: boolean;
    last_checked?: FirebaseFirestoreTypes.Timestamp;
    active?: boolean;
    longest_streak?: number;
    streak?: number;
    total_day_volume?: number;
    average_duration?: number;
    count?: number;
    key: string;
    description: string;
    name: string;
    condition?: number;
    success_tp?: FirebaseFirestoreTypes.Timestamp;
  };
  key: number;
  water_master_streak?: number;
}

export default function ChallengeListItem(props: ChallengeProps) {
  const { water_master_streak, item } = props;
  const {
    key,
    description,
    success,
    streak,
    active,
    total_day_volume,
    condition,
    name,
    success_tp,
  } = item;

  const theme = useThemeColor();

  const [expandStatus, setExpandStatus] = useState<boolean>(false);

  const progressionIndicator = () => {
    switch (key) {
      case "streak":
        return (
          <View
            style={[
              styles.item_progression_streak,
              {
                marginLeft: -(streak?.toString().length ?? 1) * 2,
                marginRight: -(streak?.toString().length ?? 1) * 2,
              },
            ]}
          >
            <Text
              style={[
                styles.item_progression_streak_number,
                {
                  color: theme.streak,
                },
              ]}
            >
              {streak}
            </Text>
            <Flame strokeWidth={3} size={22} color={theme.streak} />
          </View>
        );
        break;
      default:
        let progression;

        if (key == "express_shower") {
          // progression = streak / (condition ?? 1);
          progression = (2 / 7) * 100;
        } else {
          progression = (water_master_streak / (condition ?? 1)) * 100;
        }

        return success || progression >= 100 ? (
          <View
            style={[
              styles.item_progression_100,
              { backgroundColor: theme.success, borderColor: theme.stroke },
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
        );
        break;
    }
  };

  const handleExpandChallengeDescription = () => {
    setExpandStatus((prev) => !prev);
  };

  return (
    <ButtonContainer action={handleExpandChallengeDescription}>
      <Animated.View
        style={[
          styles.item,
          { backgroundColor: theme.light_text, borderColor: theme.stroke },
        ]}
      >
        <View style={styles.item_progression}>{progressionIndicator()}</View>
        <View style={[styles.item_text, { maxHeight: 200 }]}>
          <View style={styles.item_text_header}>
            <Text
              numberOfLines={2}
              style={[
                styles.item_text_header_title,
                { color: theme.dark_text },
              ]}
            >
              {name}
            </Text>
            {success_tp && (
              <Text
                style={[
                  styles.item_text_header_date,
                  { color: theme.dark_text },
                ]}
              >
                {moment(success_tp).locale("fr").format("DD/MM/YY")}
              </Text>
            )}
          </View>
          <Text
            style={[
              styles.item_text_description,
              { color: theme.secondary_text },
            ]}
            numberOfLines={expandStatus ? 6 : 2}
          >
            {description}
            {success == false &&
              ` Vous êtes à ${streak ?? water_master_streak} jour${
                (streak ?? water_master_streak) == 1 ? "" : "s"
              } sur ${condition}.`}
          </Text>
        </View>
      </Animated.View>
    </ButtonContainer>
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
    minHeight: 30,
    minWidth: 30,
  },

  item_progression_streak: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    minHeight: 30,
    minWidth: 30,
  },
  item_progression_streak_number: {
    fontFamily: "Figtree-Bold",
    fontSize: 24,
    letterSpacing: -1,
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
