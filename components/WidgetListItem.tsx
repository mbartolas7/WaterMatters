import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";

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

  const [widgetWidth, setWidgetWidth] = useState(undefined);

  const theme = useThemeColor();

  const chart_width =
    size == 2
      ? Dimensions.get("window").width - 30
      : (Dimensions.get("window").width - 30 - 10) / 2;

  const bar_sample_data = [
    { value: 250, label: "M" },
    // { value: 500, label: "T", frontColor: "#177AD5" },
    { value: 500, label: "T" },
    { value: 745, label: "W" },
    { value: 320, label: "T" },
    { value: 600, label: "F" },
    { value: 256, label: "S" },
    { value: 680, label: "S" },
  ];

  const pie_sample_data = [
    { value: 70, color: theme.tint },
    { value: 30, color: "lightgray" },
  ];

  const renderContent = () => {
    switch (type) {
      case "chart":
        return (
          <View style={styles.bar_chart}>
            <BarChart
              data={bar_sample_data}
              frontColor={theme.tint}
              yAxisThickness={0}
              xAxisThickness={0}
              barBorderRadius={4}
              barWidth={20}
              // 30 = item padding ; 40 = estimated yAxisValues width + charts padding ; 20 = barWidth
              spacing={(chart_width - 30 - 50) / bar_sample_data.length - 20}
              yAxisLabelWidth={40}
              yAxisTextStyle={[
                styles.chart_ytext,
                { color: theme.secondary_text },
              ]}
              disablePress
              noOfSections={3}
              disableScroll
              // initialSpacing={8}
              // endSpacing={5}
            />
          </View>
        );
        break;
      case "goal":
        // const radius = chart_width / 2 / 1.5;
        const radius = chart_width / 2 / 3;
        return (
          // <View style={{    gap: 20,
          // alignItems: "center",
          // justifyContent: "center",}}>
          //   <PieChart
          //     data={pie_sample_data}
          //     innerRadius={radius - 20}
          //     radius={radius}
          //     donut
          //     strokeColor={"red"}
          //   />
          //   <Text style={[styles.text, { color: theme.dark_text }]}>
          //     <Text style={styles.bold_text}>Douche : </Text> 7 / 10 litres
          //     consommés
          //   </Text>
          // </View>
          <View style={styles.pie_chart}>
            <PieChart
              data={pie_sample_data}
              innerRadius={radius - 12.5}
              radius={radius}
              donut
              strokeColor={"red"}
            />
            <View style={styles.pie_chart_text}>
              <Text style={[styles.text, { color: theme.dark_text }]}>
                <Text style={styles.bold_text}>Douche : {"\n"}</Text> 7 / 10
                litres consommés
              </Text>
            </View>
          </View>
        );

      case "current":
        return (
          <View style={styles.current}>
            <Text style={styles.title}>En cours d'utilisation : </Text>
            <Text style={styles.text}>Douche salle de bain</Text>
          </View>
        );

      case "logs":
        return (
          <View style={styles.logs}>
            <Text style={styles.title}>Dernières utilisations : </Text>
            <Text style={styles.text}> • Douche | Salle de bain</Text>
            <Text style={styles.text}> • Évier | Cuisine</Text>
            <Text style={styles.text}> • Lavabo | Salle de bain</Text>
            <Text style={styles.text}> • Machine à laver | Buanderie</Text>
          </View>
        );
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
        },
      ]}
    >
      {widgetWidth && renderContent()}
    </View>
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

  bar_chart: {
    width: "100%",
    paddingVertical: 5,
  },

  chart_ytext: {
    fontFamily: "Figtree-Medium",
    color: "red",
  },

  pie_chart: {
    gap: 20,
    width: "100%",
  },
  pie_chart_text: {
    maxWidth: "85%",
    alignSelf: "flex-end",
  },

  current: {
    flex: 1,
    gap: 5,
  },

  logs: {
    flex: 1,
    gap: 5,
    width: "100%",
  },

  title: {
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    letterSpacing: -0.4,
  },
  text: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -0.4,
    textAlign: "left",
  },
  bold_text: {
    fontFamily: "Figtree-Bold",
  },
});
