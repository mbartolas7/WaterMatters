import WidgetListItem from "@/components/WidgetListItem";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getAllAvailableWidgets } from "@/redux/slices/widgetsSlice";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

export default function Modal() {
  const theme = useThemeColor();

  const all_available_widgets = useSelector(getAllAvailableWidgets);

  useEffect(() => console.log(all_available_widgets), []);

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

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.light_bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.header_cancel}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.header_save, { color: theme.tint }]}>
            Enregistrer
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.list}
        data={all_available_widgets.filter(
          (item) => widgets.findIndex((item2) => item2.type == item.type) == -1
        )}
        showsVerticalScrollIndicator={false}
        // Vertical gap
        contentContainerStyle={{ gap: 10, paddingTop: 10, paddingBottom: 30 }}
        // Horizontal gap
        columnWrapperStyle={{ gap: 10 }}
        numColumns={2}
        renderItem={({ item, index }) => {
          if (item.size == 0) return <></>;

          return <WidgetListItem key={index} {...item} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingHorizontal: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 15,
    width: "100%",
  },
  header_cancel: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 16,
  },
  header_save: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 16,
  },

  list: {
    // flex: 1,
    width: "100%",
  },
});
