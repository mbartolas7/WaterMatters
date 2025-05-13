import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks/useThemeColor";
import TipsListItem from "@/components/TipsListItem";
import { ShowerHead } from "lucide-react-native";

interface TipsProps {
  title: string;
  description: string;
  progression: number;
  success_date?: EpochTimeStamp;
}

export default function TipsScreen() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const scrollY = useSharedValue(0);

  const insets = useSafeAreaInsets();
  const theme = useThemeColor();

  const tips: TipsProps = [
    {
      title: "Conseil 1",
      description:
        "Pour consommer moins, nous vous recommandons d'acheter cette tête de douche plus économe chez notre partenaire Mr Bricolage !",
      icon: <ShowerHead size={33} color={theme.tint} />,
    },
  ];

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
          Conseils
        </Text>
      </Animated.View>

      {/* <Animated.ScrollView
        style={[styles.main, { paddingTop: headerHeight }]}
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        
      </Animated.ScrollView> */}

      {headerHeight !== 0 && (
        <Animated.FlatList
          style={[styles.main, { paddingTop: headerHeight }]}
          data={tips}
          contentContainerStyle={{ gap: 6, paddingBottom: 120, paddingTop: 15 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TipsListItem key={index} item={item} />
          )}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 15,
  },
  main_date: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
  main_date_text: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 18,
  },

  bottom_sheet: {
    paddingHorizontal: 12,
  },

  bottom_sheet_footer: {
    alignSelf: "center",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    overflow: "hidden",
  },
  bottom_sheet_footer_text: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 18,
    // letterSpacing: -0.4,
  },

  date_picker: {
    marginTop: 15,
  },
  date_picker_header: {
    marginBottom: 15,
  },
  date_picker_today: {
    borderWidth: 2,
  },
  date_picker_selected: {},
  date_selected_label: {},
  date_picker_title: {
    textTransform: "capitalize",
    fontFamily: "Figtree-SemiBold",
    fontSize: 18,
  },
  date_picker_text: {
    textTransform: "capitalize",
    paddingHorizontal: 2,
    fontFamily: "Figtree-Medium",
  },
  date_picker_item: {
    borderWidth: 2,
    borderRadius: 12,
    overflow: "hidden",
  },

  section: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    marginTop: 10,
  },
  section_title: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 18,
    letterSpacing: -0.4,
    // marginTop: 5,
    marginBottom: 20,
    // marginLeft: -5,
  },

  main_summary_text: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 18,
    letterSpacing: -0.4,
  },
  main_summary_text_number: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
  },

  main_chart: {
    borderRadius: 15,
    borderWidth: 2,
    paddingTop: 20,
    padding: 15,
    marginTop: 10,
  },
  main_chart_text: {
    fontFamily: "Figtree-Regular",
    fontSize: 14,
  },

  main_historic_list: {
    flex: 1,
  },

  list_separator: {
    height: 1,
    width: "100%",
    marginVertical: 10,
  },
});
