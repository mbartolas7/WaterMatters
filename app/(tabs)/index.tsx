import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Cog } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Link } from "expo-router";
import WidgetListItem from "@/components/WidgetListItem";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();

  const handleNavigateToSettings = () => {};

  const widgets = [
    {
      size: 2,
      type: "chart",
      config: {},
    },
    { size: 0 },
    {
      size: 1,
      type: "goal",
      config: {},
    },
    {
      size: 1,
      type: "current",
    },
    {
      size: 2,
      type: "logs",
    },
    { size: 0 },
    {
      size: 2,
      type: "logs",
    },
    { size: 0 },
    {
      size: 2,
      type: "logs",
    },
    { size: 0 },
    {
      size: 1,
      type: "goal",
      config: {},
    },
    { size: 0 },
    {
      size: 2,
      type: "logs",
    },
  ] as const;

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
          Bonjour Mathias 👋
        </Text>
        <TouchableOpacity onPress={handleNavigateToSettings}>
          <Cog color={theme.dark_text} />
        </TouchableOpacity>
      </View>
      {/* <ScrollView
        style={styles.main}
      >
        <Link href="/modal" style={{}}>
          Open modal
        </Link>
        {widgets.map((widget, index) => (
          <WidgetListItem key={index} {...widget} />
        ))}
      </ScrollView> */}
      <FlatList
        // Vertical gap
        contentContainerStyle={{ gap: 10 }}
        // Horizontal gap
        columnWrapperStyle={{ gap: 10 }}
        data={widgets}
        numColumns={2}
        style={styles.main}
        renderItem={({ item, index }) =>
          item.size == 0 ? (
            <></>
          ) : (
            <View
              style={[
                styles.widget,
                item.size === 2 ? styles.fullWidth : styles.halfWidth,
              ]}
            >
              <WidgetListItem {...item} key={index} />
            </View>
          )
        }
      />
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

  main: {
    // columnGap: 10,
  },
  widget: {},
  fullWidth: {
    width: "100%", // ✅ Widget pleine largeur
  },
  halfWidth: {
    width: "50%", // ✅ Deux widgets par ligne
  },
});
