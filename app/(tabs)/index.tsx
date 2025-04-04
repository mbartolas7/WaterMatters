import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Cog, PencilLine } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks/useThemeColor";
import { router, useNavigation } from "expo-router";
import WidgetListItem from "@/components/WidgetListItem";
import ButtonContainer from "@/components/button/ButtonContainer";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();

  const navigation = useNavigation();

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
      config: {
        id: 1,
      },
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
      config: {
        id: 2,
      },
    },
    {
      size: 1,
      type: "goal",
      config: {
        id: 1,
      },
    },
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
      <FlatList
        // Vertical gap
        contentContainerStyle={{ gap: 10, paddingBottom: 110 }}
        // Horizontal gap
        columnWrapperStyle={{ gap: 10 }}
        data={widgets}
        numColumns={2}
        style={styles.main}
        renderItem={({ item, index }) =>
          item.size == 0 ? <></> : <WidgetListItem {...item} key={index} />
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (
          <ButtonContainer action={() => router.push("/modal")}>
            <View
              style={[
                styles.button,
                {
                  borderColor: theme.stroke,
                  backgroundColor: theme.light_text,
                },
              ]}
            >
              <PencilLine color={theme.dark_text} />
              <Text style={[styles.button_text, { color: theme.dark_text }]}>
                Personaliser les widgets
              </Text>
            </View>
          </ButtonContainer>
        )}
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
    width: "100%",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "auto",
    alignSelf: "center",
  },
  button_text: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    letterSpacing: -0.4,
  },
});
