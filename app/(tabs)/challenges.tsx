import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Trophy } from "lucide-react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export default function ChallengesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bg,
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.header_title, { color: theme.dark_text }]}>
          Défis
        </Text>
      </View>
      <View style={styles.main}>
        <View style={styles.card}>
          <LinearGradient
            colors={[theme.tint, theme.dark_tint]}
            style={styles.card_gradient}
            start={{ x: 0, y: 0 }}
          >
            <View style={styles.card_gradient_left}>
              <Text
                style={[
                  styles.card_gradient_left_title,
                  { color: theme.light_text },
                ]}
              >
                Mathias
              </Text>
              <View style={styles.card_gradient_left_text}>
                <Text>x/x défis</Text>
                <Text>x points</Text>
              </View>
            </View>

            <View style={styles.card_gradient_right}>
              <Trophy color={theme.light_text} size={104} strokeWidth={1.5} />
            </View>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBlock: 25,
  },
  header_title: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 24,
    letterSpacing: -0.4,
  },

  main: {},

  card: {
    width: "100%",
    height: "auto",
  },
  card_gradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 15,
  },
  card_gradient_left: {
    flexDirection: "column",
    gap: 80,
    padding: 10,
  },
  card_gradient_left_title: {},
  card_gradient_left_text: {},
  card_gradient_right: {
    justifyContent: "flex-end",
  },
});
