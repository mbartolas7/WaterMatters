import { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";

import { useThemeColor } from "@/hooks/useThemeColor";

export default function ChartsScreen() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const scrollY = useSharedValue(0);

  const insets = useSafeAreaInsets();
  const theme = useThemeColor();

  const headerAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(scrollY.value > 50 ? 0 : 1, {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      }),
      transform: [
        {
          translateY: withTiming(scrollY.value > 50 ? -40 : 0),
        },
      ],
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

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
      <Animated.View
        style={[
          styles.header,
          headerAnimatedStyles,
          { top: insets.top, backgroundColor: theme.bg },
        ]}
        onLayout={handleLayout}
      >
        <Text style={[styles.header_title, { color: theme.dark_text }]}>
          Statistiques
        </Text>
      </Animated.View>
      <Animated.ScrollView style={[styles.main, { paddingTop: headerHeight }]}>
        <View style={styles.main_date}>
          <Text></Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  header: {
    width: Dimensions.get("window").width,
    paddingTop: 30,
    paddingBottom: 10,
    position: "absolute",
    zIndex: 9999,
    paddingHorizontal: 15,
  },
  header_title: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 24,
    letterSpacing: -0.4,
  },

  main: {
    width: "100%",
    marginTop: 15,
  },
  main_date: {},
});
