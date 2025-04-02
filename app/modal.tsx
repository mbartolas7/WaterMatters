import WidgetListItem from "@/components/WidgetListItem";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import {
  FlatList,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";

export default function Modal() {
  const theme = useThemeColor();

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

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan_gesture = Gesture.Pan().onUpdate((event) => {
    translateX.value = event.translationX;
    translateY.value = event.translationY;
  });

  const animated_styles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

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
        data={widgets}
        scrollEnabled={false}
        // Vertical gap
        contentContainerStyle={{ gap: 10, paddingTop: 10 }}
        // Horizontal gap
        columnWrapperStyle={{ gap: 10 }}
        numColumns={2}
        renderItem={({ item, index }) => {
          if (item.size == 0) return <></>;

          return (
            <GestureDetector gesture={pan_gesture}>
              <Animated.View style={{ ...animated_styles }}>
                <WidgetListItem key={index} {...item} />
              </Animated.View>
            </GestureDetector>
          );
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
