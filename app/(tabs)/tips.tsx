import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TipsScreen() {
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
          Conseils
        </Text>
      </View>
      <View style={styles.main}></View>
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
});
