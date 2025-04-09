import { useCallback, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";

import { useThemeColor } from "@/hooks/useThemeColor";
import moment from "moment";
import { ChevronDown } from "lucide-react-native";
import ButtonContainer from "@/components/button/ButtonContainer";

export default function ChartsScreen() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const scrollY = useSharedValue(0);

  const insets = useSafeAreaInsets();
  const theme = useThemeColor();

  const defaultStyles = useDefaultStyles();

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<DateType>(today);

  const [bottomSheetShown, setBottomSheetShown] = useState(false);

  const date_picker_sheet = useRef<BottomSheet>(null);

  const getDateText = () => {
    let text = "";
    if (moment(selectedDate).isSame(today, "day")) {
      text += "Ajourd'hui, ";
    } else if (
      moment(selectedDate).isSame(moment(today).subtract(1, "day"), "day")
    ) {
      text += "Hier, ";
    } else if (
      moment(selectedDate).isSame(moment(today).subtract(2, "day"), "day")
    ) {
      text += "Avant-hier, ";
    }

    if (moment(selectedDate).isSame(today, "year")) {
      text += moment(selectedDate).format("D MMMM");
    } else {
      text += moment(selectedDate).format("D MMMM YYYY");
    }

    return text;
  };

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

  const toggleShowBottomSheet = () => {
    if (bottomSheetShown) {
      date_picker_sheet.current?.close();
    } else date_picker_sheet.current?.collapse();
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => date_picker_sheet.current?.close()}
      >
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
          <Animated.ScrollView
            style={[styles.main, { paddingTop: headerHeight }]}
          >
            <TouchableOpacity
              onPress={toggleShowBottomSheet}
              style={styles.main_date}
            >
              <Text style={[styles.main_date_text, { color: theme.dark_text }]}>
                {getDateText()}
              </Text>
              <ChevronDown color={theme.dark_text} />
            </TouchableOpacity>
          </Animated.ScrollView>
        </View>
      </TouchableWithoutFeedback>
      <BottomSheet
        index={-1}
        enablePanDownToClose
        snapPoints={["50%", "65%"]}
        ref={date_picker_sheet}
        // handleComponent={() => <></>}
      >
        <BottomSheetView
          style={[styles.bottom_sheet, { backgroundColor: theme.light_bg }]}
        >
          <DateTimePicker
            mode="single"
            date={selectedDate}
            onChange={({ date }) => setSelectedDate(date)}
            styles={{
              ...defaultStyles,
              today: { borderColor: "blue", borderWidth: 1 }, // Add a border to today's date
              selected: { backgroundColor: "blue" }, // Highlight the selected day
              selected_label: { color: "white" }, // Highlight the selected day label
              month_label: styles.date_picker_text,
              month_selector_label: styles.date_picker_title,
              year_selector_label: styles.date_picker_title,
              day_label: styles.date_picker_text,
            }}
            firstDayOfWeek={1}
            locale="fr"
            timeZone="Europe/Brussels"
            showOutsideDays
            navigationPosition="right"
            monthsFormat="full"
            maxDate={today}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
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
  main_date: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  main_date_text: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 18,
    letterSpacing: -0.4,
  },

  bottom_sheet: {
    paddingHorizontal: 12,
  },

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
});
