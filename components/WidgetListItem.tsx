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

  const theme = useThemeColor();

  const chart_width =
    size == 2
      ? Dimensions.get("window").width - 30
      : (Dimensions.get("window").width - 30 - 10) / 2;

  const bar_sample_data = [
    { value: 250, label: "L" },
    // { value: 500, label: "T", frontColor: "#177AD5" },
    { value: 500, label: "M" },
    { value: 745, label: "M" },
    { value: 320, label: "J" },
    { value: 600, label: "V" },
    { value: 256, label: "S" },
    { value: 680, label: "D" },
  ];

  const pie_sample_data = [
    { value: 70, color: theme.tint },
    { value: 30, color: theme.light_bg },
  ];

  const renderContent = () => {
    switch (type) {
      case "chart":
        return (
          <View style={styles.section}>
            <Text style={styles.title}>Cette semaine : </Text>
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
              // initialSpacing={8}
              endSpacing={5}
              yAxisLabelSuffix="L"
            />
          </View>
        );
        break;
      case "goal":
        const radius = 20;
        return (
          <View style={styles.section}>
            <Text style={styles.title}>
              Objectif sur {config.id == 1 ? "Douche" : "Lavabos"} :
            </Text>
            <View style={styles.section_pie_chart}>
              <PieChart
                data={pie_sample_data}
                innerRadius={radius - 8}
                radius={radius}
                donut
                strokeWidth={1}
                strokeColor={theme.stroke}
                innerCircleBorderColor={theme.stroke}
                innerCircleBorderWidth={1}
              />
              <Text style={styles.section_pie_chart_text}>1 / 10L</Text>
            </View>
          </View>
        );
        break;

      case "current":
        return (
          <View style={styles.section}>
            <Text style={styles.title}>En cours d'utilisation : </Text>
            <Text style={styles.text}>Douche salle de bain</Text>
          </View>
        );
        break;

      case "logs":
        return (
          <View style={styles.section}>
            <Text style={styles.title}>Dernières utilisations : </Text>
            <Text style={styles.text}> • Douche | Salle de bain</Text>
            <Text style={styles.text}> • Évier | Cuisine</Text>
            <Text style={styles.text}> • Lavabo | Salle de bain</Text>
            <Text style={styles.text}> • Machine à laver | Buanderie</Text>
          </View>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },

  bar_chart: {
    width: "100%",
    paddingVertical: 5,
    gap: 10,
  },

  bar_chart_text: {
    fontFamily: "Figtree-Medium",
  },

  pie_chart: {
    gap: 20,
    width: "100%",
  },
  pie_chart_text: {
    maxWidth: "85%",
    alignSelf: "flex-end",
  },

  section: {
    flex: 1,
    gap: 10,
    width: "100%",
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
