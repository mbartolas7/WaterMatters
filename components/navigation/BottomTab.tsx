import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import BottomTabButton from "./BottomTabButton";

import { useThemeColor } from "@/hooks/useThemeColor";

export default function BottomTab(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;

  const theme = useThemeColor();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottom_tab, { bottom: insets.bottom }]}>
      <BlurView
        style={[styles.bottom_tab_icons, { borderColor: theme.stroke }]}
        intensity={15}
        tint={theme.blur_tint}
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
