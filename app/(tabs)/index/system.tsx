import { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
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
} from "react-native-reanimated";

import ArrowLeft from "@/components/icon/ArrowLeft";
import ButtonContainer from "@/components/button/ButtonContainer";

import firestore from "@react-native-firebase/firestore";

import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheetModalContainer from "@/components/sheets/BottomSheetModalContainer";
import {
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useShowBottomTab } from "@/hooks/useShowBottomTab";

const sensorsCollection = firestore().collection("sensors");

interface SensorProps {
  name: string;
  room: string;
  id: number;
  key: string;
  type: string;
}

interface BottomSheetModalRef {
  toggleShowBottomSheet: () => void;
}

const rooms_data = [
  "Salle de bain",
  "Cuisine",
  "Chambre",
  "Salon",
  "Salle à manger",
  "Buanderie",
];

const types_data = [
  "Douche",
  "Évier",
  "Machine à laver",
  "Lave vaisselle",
  "Autre",
];

export default function SystemScreen() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const [sensors, setSensors] = useState<SensorProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [input, setInput] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [itemKey, setItemKey] = useState("");

  const scrollY = useSharedValue(0);

  const theme = useThemeColor();
  const insets = useSafeAreaInsets();

  const rename_sheet = useRef<BottomSheetModalRef>(null);
  const room_sheet = useRef<BottomSheetModalRef>(null);
  const type_sheet = useRef<BottomSheetModalRef>(null);

  const input_ref = useRef(null);

  const { showBottomTab, setShowBottomTab } = useShowBottomTab();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await sensorsCollection.get().then((querySnapshot) => {
      const data = [] as SensorProps[];
      querySnapshot.forEach((documentSnapshot) => {
        const doc_data = documentSnapshot.data() as Omit<SensorProps, "key">;
        data.push({ ...doc_data, key: documentSnapshot.id });
      });

      setSensors(data);
      setLoading(false);
    });
  };

  const handleRename = () => {
    if (input.length !== 0) {
      sensorsCollection
        .doc(itemKey)
        .update({
          name: input,
        })
        .then(() => {
          Alert.alert("Succès", "Appareil renommé avec succès");
          rename_sheet.current?.toggleShowBottomSheet();
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      Alert.alert("Erreur", "Veuillez entrer un nom valide !");
    }
  };

  const handleChangeRoom = () => {
    if (selectedRoom.length !== 0) {
      sensorsCollection
        .doc(itemKey)
        .update({
          room: selectedRoom,
        })
        .then(() => {
          Alert.alert("Succès", "Pièce mise à jour avec succès");
          room_sheet.current?.toggleShowBottomSheet();
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      Alert.alert("Erreur", "Désolé, une erreur est survenue");
    }
  };

  const handleChangeType = () => {
    if (selectedType.length !== 0) {
      sensorsCollection
        .doc(itemKey)
        .update({
          type: selectedType,
        })
        .then(() => {
          Alert.alert("Succès", "Type mis à jour avec succès");
          type_sheet.current?.toggleShowBottomSheet();
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      Alert.alert("Erreur", "Désolé, une erreur est survenue");
    }
  };

  const handleChangeInput = (text: string) => {
    setInput(text);
  };

  const sensorListItem = ({
    item,
    index,
  }: {
    item: SensorProps;
    index: number;
  }) => {
    const { name, room, id, key, type } = item;

    return (
      <View
        style={[
          styles.list_item,
          { backgroundColor: theme.light_bg, borderColor: theme.stroke },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setInput(name);
            setItemKey(key);
            rename_sheet.current?.toggleShowBottomSheet();
          }}
        >
          <Text style={[styles.list_item_title, { color: theme.dark_text }]}>
            {name}
          </Text>
        </TouchableOpacity>
        <View style={styles.list_item_text}>
          <TouchableOpacity
            onPress={() => {
              setSelectedRoom(room);
              setItemKey(key);
              room_sheet.current?.toggleShowBottomSheet();
            }}
          >
            <Text
              style={[styles.list_item_text_room, { color: theme.dark_text }]}
            >
              <Text style={styles.list_item_text_room_bold}>Pièce : </Text>
              {room}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedType(type);
              setItemKey(key);
              type_sheet.current?.toggleShowBottomSheet();
            }}
          >
            <Text
              style={[styles.list_item_text_room, { color: theme.dark_text }]}
            >
              <Text style={styles.list_item_text_room_bold}>Type : </Text>
              {type}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const roomListItem = ({ item, index }: { item: string; index: number }) => {
    const selected = item == selectedRoom;
    return (
      <TouchableOpacity
        onPress={() => setSelectedRoom(item)}
        style={styles.bottom_sheet_room}
      >
        <Text style={styles.bottom_sheet_room_text}>{item}</Text>
        <View
          style={[
            styles.bottom_sheet_room_selector,
            {
              borderColor: theme.tint,
              backgroundColor: selected ? theme.tint : "white",
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  const typeListItem = ({ item, index }: { item: string; index: number }) => {
    const selected = item == selectedType;
    return (
      <TouchableOpacity
        onPress={() => setSelectedType(item)}
        style={styles.bottom_sheet_room}
      >
        <Text style={styles.bottom_sheet_room_text}>{item}</Text>
        <View
          style={[
            styles.bottom_sheet_room_selector,
            {
              borderColor: theme.tint,
              backgroundColor: selected ? theme.tint : "white",
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  const headerAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(scrollY.value > 50 ? -30 : 0),
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
          <Link href="..">
            <ArrowLeft color={theme.dark_text} />
          </Link>
          <Text style={[styles.header_title, { color: theme.dark_text }]}>
            Système
          </Text>
        </Animated.View>

        {headerHeight !== 0 && (
          <Animated.FlatList
            data={sensors}
            renderItem={sensorListItem}
            style={[styles.list, { paddingTop: headerHeight }]}
            contentContainerStyle={{ gap: 8, paddingBottom: 120 }}
            columnWrapperStyle={{ gap: 8 }}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            ListHeaderComponent={() => loading && <ActivityIndicator />}
          />
        )}
      </View>
      <BottomSheetModalContainer
        title={"Renommer l'appareil"}
        snap_points={["75%"]}
        ref={rename_sheet}
        onAnimate={(actual_index, next_index) => {
          // index == -1 => close
          // index == 0 => first snap point in the array
          if (next_index == -1) {
            setShowBottomTab(true);
          } else {
            setShowBottomTab(false);
          }
        }}
        footer_dependencies={[input]}
        footer={
          <ButtonContainer action={() => handleRename()}>
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
        input_ref={input_ref}
      >
        <TouchableWithoutFeedback onPress={() => input_ref.current?.blur()}>
          <BottomSheetView
            style={[styles.bottom_sheet, { backgroundColor: theme.light_bg }]}
          >
            <BottomSheetTextInput
              style={[
                styles.bottom_sheet_input,
                { backgroundColor: theme.light_bg, borderColor: theme.stroke },
              ]}
              placeholder="Nom"
              value={input}
              onChangeText={handleChangeInput}
              ref={input_ref}
            />
          </BottomSheetView>
        </TouchableWithoutFeedback>
      </BottomSheetModalContainer>

      <BottomSheetModalContainer
        title={"Pièce liée à l'appareil"}
        snap_points={["75%"]}
        ref={room_sheet}
        onAnimate={(actual_index, next_index) => {
          // index == -1 => close
          // index == 0 => first snap point in the array
          if (next_index == -1) {
            setShowBottomTab(true);
          } else {
            setShowBottomTab(false);
          }
        }}
        footer_dependencies={[selectedRoom]}
        footer={
          <ButtonContainer action={() => handleChangeRoom()}>
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
        <BottomSheetFlatList
          data={rooms_data}
          style={[styles.bottom_sheet, { backgroundColor: theme.light_bg }]}
          renderItem={roomListItem}
          contentContainerStyle={{ gap: 15 }}
        />
      </BottomSheetModalContainer>

      <BottomSheetModalContainer
        title={"Type de l'appareil"}
        snap_points={["75%"]}
        ref={type_sheet}
        onAnimate={(actual_index, next_index) => {
          // index == -1 => close
          // index == 0 => first snap point in the array
          if (next_index == -1) {
            setShowBottomTab(true);
          } else {
            setShowBottomTab(false);
          }
        }}
        footer_dependencies={[selectedType]}
        footer={
          <ButtonContainer action={() => handleChangeType()}>
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
        <BottomSheetFlatList
          data={types_data}
          style={[styles.bottom_sheet, { backgroundColor: theme.light_bg }]}
          renderItem={typeListItem}
          contentContainerStyle={{ gap: 15 }}
        />
      </BottomSheetModalContainer>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  header_title: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 24,
    letterSpacing: -0.4,
  },

  list: {
    flex: 1,
    marginTop: 15,
    width: Dimensions.get("window").width,
    marginLeft: -15,
    paddingHorizontal: 15,
  },

  list_item: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 2,
    padding: 20,
    gap: 10,
  },
  list_item_text: {
    gap: 5,
  },
  list_item_title: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 18,
    letterSpacing: -0.4,
  },
  list_item_text_room: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    letterSpacing: -0.4,
    lineHeight: 18,
    flex: 1,
  },
  list_item_text_room_bold: {
    fontFamily: "Figtree-SemiBold",
  },

  bottom_sheet: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: 10,
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
  },

  bottom_sheet_input: {
    borderWidth: 2,
    overflow: "hidden",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontFamily: "Figtree-Medium",
    fontSize: 16,
  },

  bottom_sheet_room: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottom_sheet_room_text: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    letterSpacing: -0.4,
  },
  bottom_sheet_room_selector: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderRadius: 30,
  },
});
