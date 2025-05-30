import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
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

import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";

import { BottomSheetView } from "@gorhom/bottom-sheet";

import { useThemeColor } from "@/hooks/useThemeColor";
import moment from "moment";
import { ChevronDown } from "lucide-react-native";
import { useShowBottomTab } from "@/hooks/useShowBottomTab";
import { BarChart } from "react-native-gifted-charts";
import BottomSheetModalContainer from "@/components/sheets/BottomSheetModalContainer";

import ButtonContainer from "@/components/button/ButtonContainer";
import FilterList from "@/components/FilterList";
import getChartData from "@/lib/getChartData";
import HistoricListItem from "@/components/HistoricListItem";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useSelector } from "react-redux";
import { getSensors } from "@/redux/slices/sensorsSlice";
import RoomConsumptionListItem from "@/components/RoomConsumptionListItem";
import DeviceConsumptionListItem from "@/components/DeviceConsumptionListItem";

const types_data = [
  {
    name: "Global",
    id: "global",
  },
  {
    name: "Par pièce",
    id: "room",
  },
  {
    name: "Par appareil",
    id: "device",
  },
];

const date_picker_mode_data = [
  {
    name: "Jour",
    id: "single",
  },
  // { name: "Semaine", id: "week" },
  {
    name: "Mois",
    id: "month",
  },
  {
    name: "Année",
    id: "year",
  },
  {
    name: "Période",
    id: "range",
  },
];

interface BottomSheetModalRef {
  toggleShowBottomSheet: () => void;
}

interface UseProps {
  begin_tp: FirebaseFirestoreTypes.Timestamp | Date;
  end_tp: FirebaseFirestoreTypes.Timestamp | Date;
  duration: number;
  id: number;
  running: boolean;
  volume: number;
  key: string;
}

interface SensorProps {
  name: string;
  room: string;
  id: number;
  key: string;
}

interface ConsumptionDataProps {
  data: UseProps[];
  total_volume: number;
}

export default function ChartsScreen() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const scrollY = useSharedValue(0);

  const insets = useSafeAreaInsets();
  const theme = useThemeColor();

  const defaultStyles = useDefaultStyles();

  const today = new Date();
  const begin_today = new Date(today.setHours(0, 0, 0, 0));
  const end_today = new Date(today.setHours(23, 59, 59, 999));
  const [selectedDate, setSelectedDate] = useState<DateType>(today);
  const [selectedStartDate, setSelectedStartDate] = useState<DateType>();
  const [selectedEndDate, setSelectedEndDate] = useState<DateType>();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  const [appliedDate, setAppliedDate] = useState<DateType>(today);
  const [appliedStartDate, setAppliedStartDate] =
    useState<DateType>(begin_today);
  const [appliedEndDate, setAppliedEndDate] = useState<DateType>(end_today);

  const date_picker_sheet = useRef<BottomSheetModalRef>(null);

  const { showBottomTab, setShowBottomTab } = useShowBottomTab();

  const [selectedType, setSelectedType] = useState<string>("global");
  const [selectedMode, setSelectedMode] = useState<string>("single");
  const [appliedMode, setAppliedMode] = useState<string>("single");

  const [loading, setLoading] = useState<boolean>(true);

  const [consumptionData, setConsumptionData] = useState<ConsumptionDataProps>({
    data: [],
    total_volume: 0,
  });

  const sensors = useSelector(getSensors) ?? [];

  const chart_width = Dimensions.get("window").width - 30 - 30;

  useEffect(() => {
    setLoading(true);
    if (sensors.length !== 0) {
      getChartData({
        type: selectedType,
        start_date: appliedStartDate,
        end_date: appliedEndDate,
        date_mode: appliedMode,
        sensors: sensors,
      }).then((res) => {
        console.log("data");
        console.log(res);
        setConsumptionData(res);
        setLoading(false);
      });
    }
  }, [
    appliedDate,
    appliedMode,
    selectedType,
    appliedStartDate,
    appliedEndDate,
    sensors,
  ]);

  const handleApplyType = (type: string) => {
    setSelectedType(type);
  };

  const getDateText = () => {
    let text = "";

    switch (appliedMode) {
      case "single":
        if (moment(appliedDate).isSame(today, "day")) {
          text += "Aujourd'hui, ";
        } else if (
          moment(appliedDate).isSame(moment(today).subtract(1, "day"), "day")
        ) {
          text += "Hier, ";
        } else if (
          moment(appliedDate).isSame(moment(today).subtract(2, "day"), "day")
        ) {
          text += "Avant-hier, ";
        }

        if (moment(appliedDate).isSame(today, "year")) {
          text += moment(appliedDate).format("D MMMM");
        } else {
          text += moment(appliedDate).format("D MMMM YYYY");
        }
        break;
      case "range":
        text += "Du ";

        if (moment(appliedStartDate).isSame(today, "year")) {
          text += moment(appliedStartDate).format("D MMMM");
        } else {
          text += moment(appliedStartDate).format("D MMMM YYYY");
        }

        text += " au ";

        if (moment(appliedEndDate).isSame(today, "year")) {
          text += moment(appliedEndDate).format("D MMMM");
        } else {
          text += moment(appliedEndDate).format("D MMMM YYYY");
        }
        break;
      case "month":
        if (moment(appliedStartDate).isSame(today, "year")) {
          text += moment(appliedStartDate).format("MMMM");
        } else {
          text += moment(appliedStartDate).format("MMMM YYYY");
        }
        break;
      case "year":
        text += moment(appliedStartDate).format("YYYY");
        break;
      default:
        break;
    }

    return text;
  };

  const handleSelectDate = (date_data: object | number) => {
    console.log(selectedMode);
    console.log(date_data);
    if (selectedMode == "single" && typeof date_data == "object") {
      const { date } = date_data;
      // console.log(date);
      setSelectedDate(date);
    } else if (selectedMode == "range" && typeof date_data == "object") {
      const { startDate, endDate } = date_data;
      setSelectedStartDate(startDate);
      setSelectedEndDate(endDate);
    }
    // else if (selectedMode == "week") {
    // const setSelectedWeek()
    // console.log(date_data);
    // }
    else if (selectedMode == "month" && typeof date_data == "number") {
      // Number == year || index of month (january = 0)
      const is_month = date_data >= 0 && date_data <= 11;
      const is_year = date_data > 11;

      if (is_month) {
        setSelectedMonth(date_data);
      } else if (is_year) {
        setSelectedYear(date_data);
      }
    } else if (selectedMode == "year" && typeof date_data == "number") {
      setSelectedYear(date_data);
    }
  };

  const handleConfirmDate = () => {
    switch (selectedMode) {
      case "single":
        setAppliedDate(selectedDate);
        setAppliedStartDate(new Date(selectedDate.setHours(0, 0, 0, 0)));
        setAppliedEndDate(new Date(selectedDate.setHours(23, 59, 59, 999)));
        break;
      case "range":
        setAppliedStartDate(selectedStartDate);
        setAppliedEndDate(selectedEndDate);
        break;
      case "month":
        setAppliedStartDate(new Date(selectedYear, selectedMonth, 1));
        setAppliedEndDate(new Date(selectedYear, selectedMonth + 1, 0));
        break;
      case "year":
        setAppliedStartDate(new Date(selectedYear, 0, 1));
        setAppliedEndDate(new Date(selectedYear, 11, 31));
        break;
      default:
        break;
    }

    setAppliedMode(selectedMode);

    date_picker_sheet.current?.toggleShowBottomSheet();
  };

  const handleSelectMode = (mode: string) => {
    setSelectedMode(mode);
  };

  const week_selector_styles = () => {
    if (selectedMode == "week") {
      return {};
    }
    return {};
  };

  const month_selector_styles = () => {
    if (selectedMode == "month") {
      return {
        day: { display: "none" },
        days: { display: "none" },
        // header: { display: "none" },
        weekday: { display: "none" },
        weekdays: { display: "none" },
        months: {
          marginTop: 0,
        },
      };
    }
    return {};
  };

  const year_selector_styles = () => {
    if (selectedMode == "year") {
      return {
        day: { display: "none" },
        days: { display: "none" },
        // header: { display: "none" },
        weekday: { display: "none" },
        weekdays: { display: "none" },
        months: {
          marginTop: 0,
        },
        month_selector: { display: "none" },
      };
    }
    return {};
  };

  const summary = () => {
    return (
      <View>
        {consumptionData.total_volume == 0 ? (
          <Text style={[styles.main_summary_text, { color: theme.dark_text }]}>
            Vous n'avez rien consommé !
          </Text>
        ) : (
          <Text style={[styles.main_summary_text, { color: theme.dark_text }]}>
            Consommation totale :{" "}
            <Text style={styles.main_summary_text_number}>
              {Math.round(consumptionData.total_volume * 100) / 100}L
            </Text>
          </Text>
        )}
      </View>
    );
  };

  const chart = () => {
    switch (selectedType) {
      case "global":
        {
          const numberOfBars = consumptionData?.data?.length;

          const idealBarWidth = numberOfBars > 10 ? 12 : 22;
          const minSpacing = 5;

          const totalBarsWidth = idealBarWidth * numberOfBars;
          const remainingSpace = chart_width - totalBarsWidth;
          const spacing =
            numberOfBars > 10
              ? Math.max(minSpacing, remainingSpace / (numberOfBars + 5))
              : Math.max(minSpacing, remainingSpace / (numberOfBars + 1));

          if (appliedMode !== "single")
            return (
              <View style={{ marginTop: 5 }}>
                <BarChart
                  data={consumptionData.data}
                  frontColor={theme.tint}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  barBorderRadius={4}
                  barWidth={idealBarWidth}
                  spacing={spacing}
                  yAxisLabelWidth={40}
                  yAxisTextStyle={[
                    styles.main_chart_text,
                    { color: theme.secondary_text },
                  ]}
                  xAxisLabelTextStyle={[
                    styles.main_chart_text,
                    { color: theme.secondary_text },
                  ]}
                  disablePress
                  noOfSections={3}
                  disableScroll
                  initialSpacing={10}
                  endSpacing={5}
                  yAxisLabelSuffix="L"
                  maxValue={
                    Math.max(
                      ...consumptionData.data.map((item) => item.value)
                    ) + 2
                  }
                />
              </View>
            );
          return;
        }
        break;
      case "room": {
        if (consumptionData.total_volume !== 0) {
          const first_data = consumptionData.data.slice(0, 3);
          const max_value = first_data[0].value;

          const numberOfBars = first_data.length;

          if (numberOfBars == 3) {
            // Affichage sous la forme podium (2 - 1 - 3)
            [first_data[0], first_data[1]] = [first_data[1], first_data[0]];
          }

          const idealBarWidth = 26;

          const totalBarsWidth = idealBarWidth * numberOfBars;
          const remainingSpace = chart_width - totalBarsWidth;
          const spacing = remainingSpace / (numberOfBars + 0.5);

          const initialSpacing = numberOfBars == 2 ? 65 : 35;
          const endSpacing = initialSpacing / 2;

          return (
            <View style={{ marginTop: 10, marginBottom: 5, marginLeft: -5 }}>
              <BarChart
                data={first_data}
                frontColor={theme.tint}
                yAxisThickness={0}
                xAxisThickness={0}
                barBorderRadius={4}
                barWidth={idealBarWidth}
                spacing={spacing}
                yAxisLabelWidth={40}
                yAxisTextStyle={[
                  styles.main_chart_text,
                  { color: theme.secondary_text },
                ]}
                xAxisLabelTextStyle={[
                  styles.main_chart_text,
                  { color: theme.secondary_text },
                ]}
                disablePress
                noOfSections={2}
                disableScroll
                initialSpacing={initialSpacing}
                endSpacing={endSpacing}
                yAxisLabelSuffix="L"
                height={120}
                maxValue={max_value}
              />
            </View>
          );
        }

        break;
      }
      case "device": {
        if (consumptionData.total_volume !== 0)
          return (
            <FlatList
              data={consumptionData.data}
              renderItem={({ item, index }) => (
                <DeviceConsumptionListItem item={item} index={index} />
              )}
              scrollEnabled={false}
              ItemSeparatorComponent={
                <View
                  style={[
                    styles.list_separator,
                    { backgroundColor: theme.stroke },
                  ]}
                />
              }
            />
          );
        break;
      }
      default:
        break;
    }
  };

  const historic = () => {
    switch (selectedType) {
      case "global": {
        if (appliedMode == "single")
          if (consumptionData.data.length !== 0)
            return (
              <FlatList
                data={consumptionData.data}
                renderItem={({ item, index }) => (
                  <HistoricListItem
                    item={item}
                    index={index}
                    sensor={
                      sensors.filter(
                        (item2: SensorProps) => item2.id == item.id
                      )[0]
                    }
                  />
                )}
                scrollEnabled={false}
                style={styles.main_historic_list}
                ItemSeparatorComponent={() => (
                  <View
                    style={[
                      styles.list_separator,
                      { backgroundColor: theme.stroke },
                    ]}
                  />
                )}
              />
            );
        return;
      }
      case "room": {
        if (consumptionData.total_volume !== 0)
          return (
            <FlatList
              data={consumptionData.data}
              renderItem={({ item, index }) => (
                <RoomConsumptionListItem item={item} index={index} />
              )}
              scrollEnabled={false}
              ItemSeparatorComponent={
                <View
                  style={[
                    styles.list_separator,
                    { backgroundColor: theme.stroke },
                  ]}
                />
              }
            />
          );
      }
      default:
        break;
    }
  };

  const comparison = () => {
    switch (selectedType) {
      case "global": {
        // Calcul si 96 litres par jour par ex.
        const start = moment(appliedStartDate);
        const end = moment(appliedEndDate);
        const diff = end.diff(start, "days") + 1;
        const data = [
          { label: "Vous", value: consumptionData.total_volume },
          {
            label: "En moyenne",
            value: diff * 96,
          },
        ];

        const max_value = Math.max(...data.map((item) => item.value));

        const numberOfBars = 2;

        const idealBarWidth = 26;

        const totalBarsWidth = idealBarWidth * numberOfBars;
        const remainingSpace = chart_width - totalBarsWidth;
        const spacing = remainingSpace / (numberOfBars + 0.5);

        const initialSpacing = 65;
        const endSpacing = initialSpacing / 2;

        return (
          <View style={{ marginTop: 10, marginBottom: 5, marginLeft: -5 }}>
            <BarChart
              data={data}
              frontColor={theme.tint}
              yAxisThickness={0}
              xAxisThickness={0}
              barBorderRadius={4}
              barWidth={idealBarWidth}
              spacing={spacing}
              yAxisLabelWidth={40}
              yAxisTextStyle={[
                styles.main_chart_text,
                { color: theme.secondary_text },
              ]}
              xAxisLabelTextStyle={[
                styles.main_chart_text,
                { color: theme.secondary_text },
              ]}
              disablePress
              noOfSections={2}
              disableScroll
              initialSpacing={initialSpacing}
              endSpacing={endSpacing}
              yAxisLabelSuffix="L"
              height={120}
              maxValue={max_value}
            />
          </View>
        );
        break;
      }
      default:
        break;
    }
  };

  const section = (child: React.JSX.Element | undefined) => {
    if (child !== undefined)
      return (
        <View
          style={[
            styles.section,
            { backgroundColor: theme.light_bg, borderColor: theme.stroke },
          ]}
        >
          {child}
        </View>
      );
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

  return (
    <>
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
          contentContainerStyle={{ paddingBottom: 120 }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => date_picker_sheet.current?.toggleShowBottomSheet()}
            style={styles.main_date}
          >
            <Text
              style={[
                styles.main_date_text,
                {
                  color: theme.dark_text,
                  textTransform: appliedMode == "month" ? "capitalize" : "none",
                },
              ]}
            >
              {getDateText()}
            </Text>
            <ChevronDown color={theme.dark_text} />
          </TouchableOpacity>

          <FilterList
            filters={types_data}
            handleApplyFilter={handleApplyType}
            default_filter="global"
          />

          {loading ? (
            <ActivityIndicator style={{ marginTop: 80 }} />
          ) : (
            <>
              {section(summary())}
              {section(chart())}
              {section(historic())}
              {section(comparison())}
            </>
          )}
        </Animated.ScrollView>
      </View>

      <BottomSheetModalContainer
        title={"Date"}
        snap_points={["75%"]}
        ref={date_picker_sheet}
        onAnimate={(actual_index, next_index) => {
          // index == -1 => close
          // index == 0 => first snap point in the array
          if (next_index == -1) {
            setShowBottomTab(true);
          } else {
            setShowBottomTab(false);
          }
        }}
        footer_dependencies={[
          selectedDate,
          selectedStartDate,
          selectedEndDate,
          // selectedWeek,
          selectedYear,
          selectedMonth,
          selectedMode,
        ]}
        footer={
          <ButtonContainer action={() => handleConfirmDate()}>
            <View
              style={[
                styles.bottom_sheet_footer,
                { backgroundColor: theme.tint, borderColor: theme.stroke },
              ]}
            >
              <Text
                style={[
                  styles.bottom_sheet_footer_text,
                  { color: theme.light_text },
                ]}
              >
                Valider
              </Text>
            </View>
          </ButtonContainer>
        }
      >
        <BottomSheetView
          style={[styles.bottom_sheet, { backgroundColor: theme.light_bg }]}
        >
          <FilterList
            filters={date_picker_mode_data}
            handleApplyFilter={handleSelectMode}
            default_filter={selectedMode}
          />
          <DateTimePicker
            mode={selectedMode == "range" ? "range" : "single"}
            date={
              selectedMode == "month" || selectedMode == "year"
                ? new Date(selectedYear, selectedMonth, 1)
                : selectedDate
            }
            onChange={(date: object) => handleSelectDate(date)}
            onMonthChange={(month: number) => handleSelectDate(month)}
            onYearChange={(year: number) => handleSelectDate(year)}
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            styles={{
              ...defaultStyles,
              today: {
                ...styles.date_picker_today,
                borderColor: theme.tint,
              }, // Add a border to today's date
              today_label: { color: theme.dark_text },
              selected: {
                ...styles.date_picker_selected,
                backgroundColor: theme.tint,
              }, // Highlight the selected day
              selected_label: {
                ...styles.date_selected_label,
                color: theme.light_text,
              }, // Highlight the selected day label
              header: styles.date_picker_header,
              month_label: styles.date_picker_text,
              month_selector_label: styles.date_picker_title,
              year_label: styles.date_picker_text,
              year_selector_label: styles.date_picker_title,
              day_label: styles.date_picker_text,
              selected_month: { backgroundColor: theme.tint },
              selected_year: { backgroundColor: theme.tint },
              year: { ...styles.date_picker_item, borderColor: theme.stroke },
              month: { ...styles.date_picker_item, borderColor: theme.stroke },
              day: { ...styles.date_picker_item, borderColor: theme.stroke },
              ...week_selector_styles(),
              ...month_selector_styles(),
              ...year_selector_styles(),
            }}
            style={styles.date_picker}
            firstDayOfWeek={1}
            locale="fr"
            timeZone="Europe/Brussels"
            showOutsideDays
            navigationPosition="right"
            monthsFormat="full"
            maxDate={today}
          />
        </BottomSheetView>
      </BottomSheetModalContainer>
    </>
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
