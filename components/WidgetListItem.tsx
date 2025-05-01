import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useAnimatedValue,
  View,
} from "react-native";
import { BarChart, barDataItem, PieChart } from "react-native-gifted-charts";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useState } from "react";

import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import moment from "moment";
import LogsListItem from "./widgets/LogsListItem";
import { useDispatch, useSelector } from "react-redux";
import { getSensors } from "@/redux/slices/sensorsSlice";
import getChartData from "@/lib/getChartData";
import RunningDevicesListItem from "./widgets/RunningDevicesListItem";
import * as Haptics from "expo-haptics";
import { removeWidget } from "@/redux/slices/widgetsSlice";

interface WidgetProps {
  size: 0 | 1 | 2;
  //   size: number;
  type: "chart" | "goal" | "current" | "logs";
  //   type: string;
  config?: { id?: number; mode: string };
  key: number;
  id: number;
}

interface SensorProps {
  name: string;
  room: string;
  id: number;
  key: string;
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

interface BarChartDataProps {
  label: string;
  value: number;
}

const usesCollection = firestore().collection("uses");

export default function WidgetListItem(props: WidgetProps) {
  const { size, type, config, id } = props;

  const theme = useThemeColor();

  const [data, setData] = useState<
    UseProps[] | BarChartDataProps[] | barDataItem[] | undefined
  >();
  const [dataLength, setDataLength] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);

  const sensors = useSelector(getSensors);

  const widget_scale = useAnimatedValue(1);

  const dispatch = useDispatch();

  const chart_width =
    size == 2
      ? Dimensions.get("window").width - 30 - 30
      : (Dimensions.get("window").width - 30 - 10) / 2;

  const pie_sample_data = [
    { value: 70, color: theme.tint },
    { value: 30, color: theme.light_bg },
  ];

  useEffect(() => {
    // getData();
  }, []);

  const getData = async () => {
    switch (type) {
      case "chart":
        {
          let begin_tp;
          let end_tp = new Date();

          switch (config?.mode) {
            case "week":
              begin_tp = moment()
                .local()
                .startOf("isoWeek")
                .startOf("day")
                .toDate();
              break;
            case "month":
              begin_tp = moment()
                .startOf("month")
                .add(1, "day")
                .startOf("day")
                .toDate();
              break;
            default:
              break;
          }

          await getChartData({
            type: "global",
            start_date: begin_tp,
            end_date: end_tp,
            date_mode: "week",
            sensors: sensors,
          }).then((res) => {
            console.log(res);
            setData(res.data);
          });
        }
        break;
      case "logs": {
        await usesCollection
          .limit(4)
          .orderBy("begin_tp", "desc")
          .get()
          .then((querySnapshot) => {
            const uses_data = [] as UseProps[];
            querySnapshot.forEach((documentSnapshot) => {
              const use = documentSnapshot.data() as Omit<UseProps, "key">;
              uses_data.push({ ...use, key: documentSnapshot.id });
            });

            console.log(uses_data);
            setData(uses_data);
          })
          .catch((e) => console.log(e));
      }
      case "current": {
        await usesCollection
          .where("running", "==", true)
          .get()
          .then((querySnapshot) => {
            const uses_data = [] as UseProps[];
            querySnapshot.forEach((documentSnapshot) => {
              const use = documentSnapshot.data() as Omit<UseProps, "key">;
              uses_data.push({ ...use, key: documentSnapshot.id });
            });

            console.log(uses_data);
            setDataLength(uses_data.length);
            setData(uses_data.slice(0, 3));
          });
      }
      default:
        break;
    }

    setLoading(false);
  };

  const handlePressIn = () => {
    Animated.spring(widget_scale, {
      toValue: 1.05,
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

  const handleLongPress = () => {
    Alert.alert("Alerte", "Voulez-vous supprimer ce widget ?", [
      {
        text: "Supprimer",
        onPress: () => dispatch(removeWidget(id)),
        style: "destructive",
      },
      {
        text: "Annuler",
        onPress: () => null,
        style: "cancel",
      },
    ]);
  };

  const renderContent = () => {
    if (loading || data == undefined) return <ActivityIndicator />;

    switch (type) {
      case "chart":
        return (
          <View style={styles.section}>
            <View style={styles.section_header}>
              <Text style={styles.section_header_title}>Cette semaine : </Text>
            </View>
            <View style={styles.bar_chart}>
              <BarChart
                data={data}
                frontColor={theme.tint}
                yAxisThickness={0}
                xAxisThickness={0}
                barBorderRadius={4}
                barWidth={20}
                height={chart_width / 2.2}
                // 40 = estimated yAxisValues width + charts padding ; 20 = barWidth
                spacing={(chart_width - 50) / data.length - 20}
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
                maxValue={Math.max(...data.map((item) => item.value)) + 2}
              />
              <Pressable
                style={styles.bar_chart_pressable}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onLongPress={handleLongPress}
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
              />
            </View>
            {/* <View style={styles.section_main}>
              <View style={styles.section_current_item}>
                <Text style={[styles.section_text, { color: theme.dark_text }]}>
                  Évier
                </Text>
                <Text
                  style={[
                    styles.section_secondary_text,
                    { color: theme.secondary_text },
                  ]}
                >
                  Cuisine
                </Text>
              </View>
              <View
                style={[
                  styles.section_divider,
                  { backgroundColor: theme.stroke },
                ]}
              />
              <View style={styles.section_current_item}>
                <Text style={[styles.section_text, { color: theme.dark_text }]}>
                  Lavabos
                </Text>
                <Text
                  style={[
                    styles.section_secondary_text,
                    { color: theme.secondary_text },
                  ]}
                >
                  Salle de bain
                </Text>
              </View>
            </View> */}
            <FlatList
              scrollEnabled={false}
              data={data}
              style={[styles.section_main, { gap: 2 }]}
              renderItem={({ item, index }) => (
                <RunningDevicesListItem
                  key={index}
                  item={item}
                  sensor={
                    sensors.filter(
                      (item2: SensorProps) => item2.id == item.id
                    )[0]
                  }
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
            {dataLength !== undefined && dataLength > 3 && (
              <View style={styles.section_footer}>
                <Text
                  style={[
                    styles.section_footer_text_2,
                    { color: theme.dark_text },
                  ]}
                >
                  +{dataLength - 3} appareils
                </Text>
              </View>
            )}
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
              data={data}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <LogsListItem
                  key={index}
                  item={item}
                  sensor={
                    sensors.filter(
                      (item2: SensorProps) => item2.id == item.id
                    )[0]
                  }
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
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
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
