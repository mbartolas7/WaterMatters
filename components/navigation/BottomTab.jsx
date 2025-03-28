import React from "react";
import { StyleSheet, View } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

import BottomTabButton from "./BottomTabButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

export default function BottomTab(props) {
  const { state, descriptors, navigation } = props;
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottom_tab, { bottom: insets.bottom }]}>
      <BlurView
        style={[
          styles.bottom_tab_icons,
          { borderColor: Colors[colorScheme ?? "light"].stroke },
        ]}
        intensity={10}
        tint="systemUltraThinMaterialDark"
      >
        {state.routes.map((route, index) => (
          <BottomTabButton
            key={route.key}
            route={route}
            actual={state.index}
            index={index}
            navigation={navigation}
          />
        ))}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom_tab: {
    width: "100%",
    position: "absolute",
    alignItems: "center",
  },
  bottom_tab_icons: {
    flexDirection: "row",
    width: "70%",
    maxWidth: 400,
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 2,
    overflow: "hidden",
  },
});
