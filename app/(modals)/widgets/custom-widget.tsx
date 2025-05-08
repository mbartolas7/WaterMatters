import ButtonContainer from "@/components/button/ButtonContainer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import WidgetListItem from "@/components/WidgetListItem";
import NewWidgetListItem from "@/components/NewWidgetListItem";
import { useEffect, useRef, useState } from "react";
import BottomSheetModalContainer from "@/components/sheets/BottomSheetModalContainer";
import { useDispatch, useSelector } from "react-redux";
import { getSensors } from "@/redux/slices/sensorsSlice";
import moment from "moment";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { addWidget } from "@/redux/slices/widgetsSlice";

interface SensorProps {
  name: string;
  room: string;
  id: number;
  key: string;
}

export default function ModalStep2() {
  const router = useRouter();
  const theme = useThemeColor();

  const params = useLocalSearchParams();

  const dispatch = useDispatch();

  const { type, size, id } = params;

  const [config, setConfig] = useState({});

  const [loading, setLoading] = useState(true);
  const [selectedCustom, setSelectedCustom] = useState("");

  const sensors = type == "goal" && useSelector(getSensors);

  const defaultStyles = useDefaultStyles();

  const input_ref = useRef(null);

  useEffect(() => {
    let config_data = {};
    try {
      if (params.config) {
        config_data = JSON.parse(params.config);
      } else {
        if (type == "goal") {
          config_data = {
            sensor: 1,
            limit: "15",
            deadline: moment().add(1, "day").toDate(),
            from: new Date(),
          };
        }
      }
    } catch (e) {
      console.error("Invalid config param", e);
    }

    setLoading(false);
    setConfig(config_data);
  }, []);

  let widget_data = {
    type: type,
    size: size,
    id: id,
    config: config,
  };

  const handleSave = () => {
    dispatch(addWidget({ type: type, size: size, id: id, config: config }));
    router.dismissTo("/");
  };

  const handleCancel = () => {
    router.back();
  };

  const title = () => {
    let text = "";
    switch (type) {
      case "chart":
        text = "Statistiques de la semaine";
        break;
      case "logs":
        text = "Dernières utilisations";
        break;
      case "goal":
        text = "Fixer un objectif";
        break;
      case "current":
        text = "Utilisations en cours";
        break;
      default:
        break;
    }

    return (
      <Text style={[styles.title, { color: theme.dark_text }]}>{text}</Text>
    );
  };

  const custom = () => {
    switch (type) {
      case "goal":
        if (config.sensor == undefined) return <ActivityIndicator />;

        const sensor_index = sensors.findIndex(
          (item) => item.id == config.sensor
        );
        const name = sensors[sensor_index].name;

        return (
          <>
            <View style={[styles.custom_item]}>
              <Text style={styles.custom_item_title}>Appareil : </Text>
              <TouchableOpacity
                onPress={() => setSelectedCustom("sensor")}
                style={styles.custom_item_touchable}
              >
                <Text style={[styles.custom_item_touchable_text]}>{name}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.custom_item]}>
              <Text style={styles.custom_item_title}>Limite : </Text>
              <TouchableOpacity
                onPress={() => setSelectedCustom("limit")}
                style={styles.custom_item_touchable}
              >
                <Text style={[styles.custom_item_touchable_text]}>
                  {config.limit}L
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.custom_item]}>
              <Text style={styles.custom_item_title}>Date : </Text>
              <TouchableOpacity
                onPress={() => setSelectedCustom("date")}
                style={styles.custom_item_touchable}
              >
                <Text style={[styles.custom_item_touchable_text]}>
                  {moment(config.deadline).format("L")}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );
        break;
      default:
        break;
    }
  };

  const select = () => {
    const handleCloseSelect = () => {
      setSelectedCustom("");
    };

    switch (selectedCustom) {
      case "sensor":
        return (
          <FlatList
            data={sensors}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setConfig((prev) => ({ ...prev, sensor: item.id }));
                  handleCloseSelect();
                }}
              >
                <Text style={styles.main_select_sensor_text}>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={styles.main_select_sensor}
            contentContainerStyle={{ gap: 12 }}
            ListHeaderComponent={() => (
              <Text style={styles.main_select_title}>
                Sélectionnez un appareil :
              </Text>
            )}
          />
        );
        break;
      case "limit":
        return (
          <>
            <Text style={styles.main_select_title}>
              Entrez la limite de consommation :
            </Text>
            <View style={styles.main_select_limit}>
              <TextInput
                style={styles.main_select_input}
                value={config.limit}
                keyboardType="decimal-pad"
                returnKeyType="default"
                placeholder="0"
                onChangeText={(text) =>
                  setConfig((prev) => ({ ...prev, limit: text }))
                }
                maxLength={5}
                ref={input_ref}
              />
              <Text>L</Text>
            </View>
          </>
        );
        break;
      case "date":
        return (
          <>
            <Text style={styles.main_select_title}>
              Sélectionnez la date limite :
            </Text>
            <DateTimePicker
              mode={"single"}
              date={config.deadline}
              onChange={(date: object) =>
                setConfig((prev) => ({ ...prev, deadline: date.date }))
              }
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
                month: {
                  ...styles.date_picker_item,
                  borderColor: theme.stroke,
                },
                day: { ...styles.date_picker_item, borderColor: theme.stroke },
              }}
              style={styles.date_picker}
              firstDayOfWeek={1}
              locale="fr"
              timeZone="Europe/Brussels"
              showOutsideDays
              navigationPosition="right"
              monthsFormat="full"
              minDate={moment().add(1, "day").toDate()}
            />
          </>
        );
        break;
      default:
        break;
    }
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.light_bg }]}>
        <View style={styles.content}>
          {title()}
          <View style={styles.main}>
            <View style={styles.main_header}>
              <View style={{ width: size == 2 ? "100%" : "50%" }}>
                {/* 
            Afficher le nouveau composant de widget dans le cas du goal car on modifie l'affichage du widget en 'temps réel' de la sélection du user
            -> Pas d'appels inutiles à firebase à chaque changement 
             */}
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <>
                    {type == "goal" ? (
                      <NewWidgetListItem
                        flex_container={false}
                        {...widget_data}
                        key={id}
                      />
                    ) : (
                      <WidgetListItem
                        flex_container={false}
                        {...widget_data}
                        key={id}
                      />
                    )}
                  </>
                )}
              </View>

              {type == "goal" && (
                <View
                  style={[
                    styles.custom,
                    {
                      borderColor: theme.stroke,
                      backgroundColor: theme.stroke,
                    },
                  ]}
                >
                  {custom()}
                </View>
              )}
            </View>

            {selectedCustom !== "" && (
              <View style={[styles.main_select, { borderColor: theme.stroke }]}>
                {select()}
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <ButtonContainer action={handleSave}>
              <View
                style={[
                  styles.footer_button,
                  { backgroundColor: theme.tint, borderColor: theme.stroke },
                ]}
              >
                <Text
                  style={[
                    styles.footer_button_text,
                    { color: theme.light_text },
                  ]}
                >
                  Ajouter le widget
                </Text>
              </View>
            </ButtonContainer>
            <ButtonContainer action={handleCancel}>
              <View
                style={[
                  styles.footer_button,
                  {
                    backgroundColor: theme.light_bg,
                    borderColor: theme.stroke,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.footer_button_text,
                    { color: theme.dark_text },
                  ]}
                >
                  Retour
                </Text>
              </View>
            </ButtonContainer>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 15,
  },

  content: {
    height: Dimensions.get("window").height - 150,
    position: "relative",
  },

  main: {
    flex: 1,
    // justifyContent: "center",
  },

  main_header: {
    gap: 10,
    flexDirection: "row",
  },

  main_select: {
    borderRadius: 15,
    borderWidth: 2,
    padding: 15,
    marginTop: 15,
  },

  main_select_sensor: {},
  main_select_sensor_text: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    letterSpacing: -0.4,
  },
  main_select_title: {
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    letterSpacing: -0.4,
    marginBottom: 5,
  },
  main_select_limit: {
    flexDirection: "row",
    gap: 3,
  },
  main_select_input: {
    fontFamily: "Figtree-Medium",
  },

  custom: {
    borderRadius: 15,
    borderWidth: 2,
    // alignItems: "center",
    padding: 15,
    overflow: "hidden",
    flex: 1,
    alignSelf: "flex-start",
    gap: 12,
  },
  custom_item: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  custom_item_title: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 16,
    letterSpacing: -0.4,
  },
  custom_item_touchable: {},
  custom_item_touchable_text: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    letterSpacing: -0.4,
  },

  title: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 24,
    letterSpacing: -0.4,
    marginBottom: 15,
  },

  footer: {
    flexDirection: "column",
    gap: 8,
    width: "100%",
    paddingBottom: 13,
  },
  footer_button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
  },
  footer_button_text: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    letterSpacing: -0.4,
  },

  date_picker: {
    marginTop: 0,
    // alignSelf: "flex-start",
    height: 315,
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
});
