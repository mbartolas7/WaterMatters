import NewWidgetListItem from "@/components/NewWidgetListItem";
import WidgetListItem from "@/components/WidgetListItem";
import { useThemeColor } from "@/hooks/useThemeColor";
import setWidgetsData from "@/lib/setWidgetsData";
import {
  getAllAvailableWidgets,
  getWidgets,
} from "@/redux/slices/widgetsSlice";
import { router } from "expo-router";
import { Info } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

interface WidgetProps {
  name?: string;
  room?: string;
  id?: number;
  key?: string;
  size: number;
  type?: string;
  config?: {
    mode?: string;
  };
}

export default function Modal() {
  const theme = useThemeColor();

  const all_available_widgets = useSelector(getAllAvailableWidgets);
  const widgets = useSelector(getWidgets);

  const [data, setData] = useState<WidgetProps[]>();

  useEffect(() => {
    getData();
  }, [all_available_widgets]);

  const getData = () => {
    const not_formatted_data = all_available_widgets.filter(
      (item) =>
        item.type == "goal" ||
        !widgets.some((item2: WidgetProps) => item2.type == item.type)
    ) as WidgetProps[];

    const formatted_data = setWidgetsData(not_formatted_data);

    console.log(formatted_data);

    setData(formatted_data);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    router.back();
  };

  const info_widget = () => (
    <View
      style={[
        styles.info_widget,
        { backgroundColor: theme.bg, borderColor: theme.stroke },
      ]}
    >
      <Info color={theme.dark_text} />
      <Text style={[styles.info_widget_text, { color: theme.dark_text }]}>
        TTT uy huiiu uh h hu i hu uhuh hui iuh hi hu h h h uh uiih h hu h iu h
        iu huh iuh u hi
      </Text>
    </View>
  );

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
        data={data}
        showsVerticalScrollIndicator={false}
        // Vertical gap
        contentContainerStyle={{ gap: 10, paddingTop: 10, paddingBottom: 30 }}
        // Horizontal gap
        columnWrapperStyle={{ gap: 10 }}
        numColumns={2}
        ListHeaderComponent={() => info_widget()}
        renderItem={({ item, index }: { index: number; item: WidgetProps }) => {
          if (item.size == 0) return <></>;

          return <NewWidgetListItem key={index} {...item} />;
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
    width: "100%",
  },

  info_widget: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 15,
    flex: 1,
    alignItems: "flex-start",
    padding: 15,
    flexDirection: "row",
    gap: 10,
  },
  info_widget_text: {
    flex: 1,
    fontFamily: "Figtree-Regular",
    fontSize: 16,
    letterSpacing: -0.4,
  },
});
