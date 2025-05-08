import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useAnimatedValue,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";

import { useThemeColor } from "@/hooks/useThemeColor";

import LogsListItem from "./widgets/LogsListItem";
import { useDispatch } from "react-redux";
import RunningDevicesListItem from "./widgets/RunningDevicesListItem";
import * as Haptics from "expo-haptics";
import {
  bar_sample_data,
  current_sample_data,
  logs_sample_data,
  pie_sample_data,
} from "@/lib/getSampleData";
import { useRouter } from "expo-router";

interface WidgetProps {
  size: 0 | 1 | 2;
  //   size: number;
  type: "chart" | "goal" | "current" | "logs";
  //   type: string;
  config?: { id?: number; mode: string };
  key: number;
  id: number;
}

export default function NewWidgetListItem(props: WidgetProps) {
  const { size, type, config, id } = props;

  const theme = useThemeColor();

  const widget_scale = useAnimatedValue(1);

  const dispatch = useDispatch();

  const router = useRouter();

  const chart_width =
    size == 2
      ? Dimensions.get("window").width - 30 - 30
      : (Dimensions.get("window").width - 30 - 10) / 2;

  const handlePressIn = () => {
    Animated.spring(widget_scale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();

    Haptics.selectionAsync();
  };

  const handlePressOut = () => {
    Animated.spring(widget_scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    router.navigate("custom-widget-modal");
  };

  const renderContent = () => {
    switch (type) {
      case "chart":
        return (
          <View style={styles.section}>
            <View style={styles.section_header}>
              <Text style={styles.section_header_title}>Cette semaine : </Text>
            </View>
            <View style={styles.bar_chart}>
              <BarChart
                data={bar_sample_data}
                frontColor={theme.tint}
                yAxisThickness={0}
                xAxisThickness={0}
                barBorderRadius={4}
                barWidth={20}
                height={chart_width / 2.2}
                // 40 = estimated yAxisValues width + charts padding ; 20 = barWidth
                spacing={(chart_width - 50) / bar_sample_data.length - 20}
                yAxisLabelWidth={40}
                yAxisTextStyle={[
                  styles.bar_chart_text,
                  { color: theme.secondary_text },
                ]}
                xAxisLabelTextStyle={[
                  styles.bar_chart_text,
                  { color: theme.secondary_text },
                ]}
                disablePress
                noOfSections={3}
                disableScroll
                initialSpacing={10}
                endSpacing={5}
                yAxisLabelSuffix="L"
                maxValue={
                  Math.max(...bar_sample_data.map((item) => item.value)) + 2
                }
              />
              <Pressable
                style={styles.bar_chart_pressable}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
              />
            </View>
          </View>
        );
        break;
      case "goal":
        const radius = 15;
        return (
          <View style={styles.section}>
            <View style={styles.section_header}>
              <Text
                style={[
                  styles.section_header_title,
                  { color: theme.dark_text },
                ]}
              >
                Objectif de conso. :
              </Text>
              <PieChart
                data={pie_sample_data}
                innerRadius={radius - 7}
                radius={radius}
                donut
                strokeWidth={1}
                strokeColor={theme.stroke}
                innerCircleBorderColor={theme.stroke}
                innerCircleBorderWidth={1}
              />
            </View>
            <View style={styles.section_main}>
              <Text style={styles.section_text}>
                Ajoutez un objectif de consommation sur un appareil
              </Text>
            </View>
            <View style={styles.section_footer}>
              <Text style={[styles.section_footer_text, {}]}>
                {pie_sample_data[0].value}%
              </Text>
            </View>
          </View>
        );
        break;

      case "current":
        return (
          <View style={styles.section}>
            <View style={styles.section_header}>
              <Text style={styles.section_header_title}>
                En cours d'utilisation :
              </Text>
              <View
                style={[
                  styles.current_circle,
                  { backgroundColor: theme.success },
                ]}
              />
            </View>
            <FlatList
              scrollEnabled={false}
              data={current_sample_data}
              style={[styles.section_main, { gap: 2 }]}
              renderItem={({ item, index }) => (
                <RunningDevicesListItem
                  key={index}
                  item={item}
                  sensor={{ name: item.name, room: item.room }}
                />
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    styles.section_divider,
                    { backgroundColor: theme.stroke },
                  ]}
                />
              )}
            />
            <View style={styles.section_footer}>
              <Text
                style={[
                  styles.section_footer_text_2,
                  { color: theme.dark_text },
                ]}
              >
                +2 appareils
              </Text>
            </View>
          </View>
        );
        break;

      case "logs":
        return (
          <View style={[styles.section, { gap: 10 }]}>
            <View style={styles.section_header}>
              <Text style={styles.section_header_title}>
                Dernières utilisations :
              </Text>
            </View>
            <FlatList
              style={[styles.section_main, { gap: 3 }]}
              data={logs_sample_data}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <LogsListItem
                  key={index}
                  item={item}
                  sensor={{ name: item.name, room: item.room }}
                />
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    styles.section_divider,
                    { backgroundColor: theme.stroke },
                  ]}
                />
              )}
            />
          </View>
        );
        break;
      default:
        return <Text>null</Text>;
        break;
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: widget_scale }],
        flex: size == 1 ? 0.5 : 1,
        // flex: 1,
      }}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[
          styles.item,
          {
            backgroundColor: theme.light_text,
            borderColor: theme.stroke,
          },
        ]}
      >
        {renderContent()}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 2,
    borderRadius: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },

  section: {
    flex: 1,
    gap: 8,
    width: "100%",
  },

  section_header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  section_main: {
    flex: 1,
    gap: 2,
  },

  section_current_item: {
    gap: 2,
  },

  section_header_title: {
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    letterSpacing: -0.4,
    lineHeight: 20,
    flex: 1,
  },
  section_text: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -0.4,
  },
  section_bold_text: {
    fontFamily: "Figtree-Bold",
  },
  section_secondary_text: {
    fontFamily: "Figtree-Regular",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.4,
  },

  section_divider: {
    height: 1,
    width: "100%",
    marginVertical: 5,
  },

  section_footer: {
    alignItems: "flex-end",
  },
  section_footer_text: {
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    letterSpacing: -0.4,
    lineHeight: 20,
  },
  section_footer_text_2: {
    fontFamily: "Figtree-Medium",
    fontSize: 14,
    letterSpacing: -0.4,
  },

  bar_chart: {
    width: "100%",
    paddingTop: 5,
    position: "relative",
  },

  bar_chart_pressable: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  bar_chart_text: {
    fontFamily: "Figtree-Regular",
    fontSize: 14,
  },

  pie_chart: {
    gap: 20,
    width: "100%",
  },
  pie_chart_text: {
    maxWidth: "85%",
    alignSelf: "flex-end",
  },

  section_pie_chart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  section_pie_chart_text: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 16,
  },

  current_circle: {
    height: 15,
    width: 15,
    borderRadius: 20,
  },
});
