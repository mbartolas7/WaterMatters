import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";

interface WidgetProps {
  size: 0 | 1 | 2;
  //   size: number;
  type: "chart" | "goal" | "current" | "logs";
  //   type: string;
  config?: { id?: number };
  key: number;
}

export default function WidgetListItem(props: WidgetProps) {
  const { size, type, config } = props;

  const theme = useThemeColor();

  const chart_width =
    size == 2
      ? Dimensions.get("window").width - 30 - 30
      : (Dimensions.get("window").width - 30 - 10) / 2;

  const bar_sample_data = [
    { value: 98, label: "L" },
    // { value: 500, label: "T", frontColor: "#177AD5" },
    { value: 94, label: "M" },
    { value: 95, label: "M" },
    { value: 89, label: "J" },
    { value: 101, label: "V" },
    { value: 100, label: "S" },
    { value: 92, label: "D" },
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
              {config?.id && (
                <Text
                  style={[
                    styles.section_header_title,
                    { color: theme.dark_text },
                  ]}
                >
                  Objectif sur {config.id == 1 ? "Douche" : "Lavabos"} :
                </Text>
              )}
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
                Attention, vous avez déjà consommé 9,2 litres. Il vous reste 5
                jours !
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
              ></View>
            </View>
            <View style={styles.section_main}></View>
          </View>
        );
        break;

      case "logs":
        return (
          <View style={styles.section}>
            <View style={styles.section_header}>
              <Text style={styles.section_header_title}>
                Dernières utilisations :
              </Text>
            </View>
            {/* <Text style={styles.title}>Dernières utilisations : </Text>
            <Text style={styles.text}> • Douche | Salle de bain</Text>
            <Text style={styles.text}> • Évier | Cuisine</Text>
            <Text style={styles.text}> • Lavabo | Salle de bain</Text>
            <Text style={styles.text}> • Machine à laver | Buanderie</Text> */}
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

  section_footer: {
    alignItems: "flex-end",
  },
  section_footer_text: {
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    letterSpacing: -0.4,
    lineHeight: 20,
  },

  bar_chart: {
    width: "100%",
    paddingTop: 5,
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
