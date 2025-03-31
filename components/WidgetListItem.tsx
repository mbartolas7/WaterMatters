import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import { useThemeColor } from "@/hooks/useThemeColor";

interface WidgetProps {
  size: 0 | 1 | 2;
  //   size: number;
  type: "chart" | "goal" | "current" | "logs";
  //   type: string;
  config?: object;
  key: number;
}

export default function WidgetListItem(props: WidgetProps) {
  const { size, type, config } = props;

  const theme = useThemeColor();

  const chart_width =
    size == 2
      ? Dimensions.get("window").width - 30 - 20
      : (Dimensions.get("window").width - 30 - 10) / 2 - 20;

  const chart_sample_data = [
    { value: 250, label: "M" },
    // { value: 500, label: "T", frontColor: "#177AD5" },
    { value: 500, label: "T" },
    { value: 745, label: "W" },
    { value: 320, label: "T" },
    { value: 600, label: "F" },
    { value: 256, label: "S" },
    { value: 10000, label: "S" },
    { value: 10000, label: "S" },
    { value: 10000, label: "S" },
    { value: 10000, label: "S" },
  ];

  // const getYAxisLabelTexts = () => {
  //   const prefix = 0;
  //   const values_number = chart_sample_data.map((item) => item.value);
  //   const min = Math.min(...values_number);

  //   const values_string = values_number.map(String);
  //   console.log(min);

  //   return values_string;
  // };

  const renderContent = () => {
    switch (type) {
      case "chart":
        return (
          <BarChart
            data={chart_sample_data}
            frontColor={theme.tint}
            yAxisThickness={0}
            xAxisThickness={0}
            barBorderRadius={4}
            barWidth={20}
            spacing={(chart_width - 40) / chart_sample_data.length / 2}
            // barWidth={chart_width / chart_sample_data.length}
            // width={chart_width}
            // adjustToWidth
            yAxisLabelWidth={40}
            yAxisTextStyle={[styles.chart_ytext, { color: theme.dark_text }]}
            disablePress
            disableScroll
            // yAxisLabelPrefix="g"
            // yAxisLabelTexts={["10"]}
          />
        );
        break;
      default:
        return <Text>null</Text>;
        break;
    }
  };

  return (
    <View
      style={[
        styles.item,
        {
          backgroundColor: theme.light_text,
          borderColor: theme.stroke,
          width: size == 1 ? "50%" : "100%",
        },
      ]}
    >
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 2,
    borderRadius: 15,
    // padding: 20,
  },

  chart_ytext: {
    fontFamily: "Figtree-Medium",
  },
});
