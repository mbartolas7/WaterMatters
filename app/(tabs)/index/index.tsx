import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Cog, PencilLine } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Link, router, useNavigation } from "expo-router";
import WidgetListItem from "@/components/WidgetListItem";
import ButtonContainer from "@/components/button/ButtonContainer";

import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

const usesCollection = firestore().collection("uses");

export default function HomeScreen() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const insets = useSafeAreaInsets();
  const theme = useThemeColor();

  const scrollY = useSharedValue(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    // const users = await usesCollection.get().then((querySnapshot) => {
    //   console.log("Total uses: ", querySnapshot.size);
    //   querySnapshot.forEach((documentSnapshot) => {
    //     console.log("use ID: ", documentSnapshot.id, documentSnapshot.data());
    //   });
    // });
  };

  const widgets = [
    {
      size: 2,
      type: "chart",
      config: {},
    },
    { size: 0 },
    {
      size: 1,
      type: "goal",
      config: {
        id: 1,
      },
    },
    {
      size: 1,
      type: "current",
    },
    {
      size: 2,
      type: "logs",
    },
    { size: 0 },
    {
      size: 2,
      type: "logs",
    },
    { size: 0 },
    {
      size: 2,
      type: "logs",
    },
    { size: 0 },
    {
      size: 1,
      type: "goal",
      config: {
        id: 2,
      },
    },
    {
      size: 1,
      type: "goal",
      config: {
        id: 1,
      },
    },
    {
      size: 2,
      type: "logs",
    },
  ] as const;

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
        <View style={styles.header_container}>
          <Text style={[styles.header_title, { color: theme.dark_text }]}>
            Bonjour Mathias 👋
          </Text>
          <Link href="settings" style={styles.header_icon}>
            <Cog color={theme.dark_text} />
          </Link>
        </View>
      </Animated.View>
      {headerHeight !== 0 && (
        <Animated.FlatList
          // Vertical gap
          contentContainerStyle={{
            gap: 10,
            paddingBottom: 110,
          }}
          // Horizontal gap
          columnWrapperStyle={{ gap: 10 }}
          data={widgets}
          numColumns={2}
          style={[styles.main, { paddingTop: headerHeight }]}
          renderItem={({ item, index }) =>
            item.size == 0 ? <></> : <WidgetListItem {...item} key={index} />
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            <ButtonContainer action={() => router.push("/modal")}>
              <View
                style={[
                  styles.button,
                  {
                    borderColor: theme.stroke,
                    backgroundColor: theme.light_text,
                  },
                ]}
              >
                <PencilLine color={theme.dark_text} />
                <Text style={[styles.button_text, { color: theme.dark_text }]}>
                  Ajouter des widgets
                </Text>
              </View>
            </ButtonContainer>
          )}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
      )}
    </View>
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
  header_container: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
  },
  header_title: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 24,
    letterSpacing: -0.4,
  },
  header_icon: {
    position: "absolute",
    right: 0,
  },

  main: {
    width: "100%",
    marginTop: 15,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "auto",
    alignSelf: "center",
  },
  button_text: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    letterSpacing: -0.4,
  },
});
