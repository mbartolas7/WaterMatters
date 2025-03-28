import { Tabs } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import BottomTab from "@/components/navigation/BottomTab";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
    //     headerShown: false,
    //     tabBarButton: HapticTab,
    //     // tabBarBackground: TabBarBackground,
    //     tabBarShowLabel: false,
    //     tabBarStyle: {
    //       borderRadius: 0,
    //       marginBottom: 25,
    //       marginHorizontal: 40,
    //       // alignItems: "center",
    //       // justifyContent: "center",
    //       // flexDirection: "row",
    //       // backgroundColor: "white",
    //       // height: "auto",
    //       // padding: 0,
    //       flexDirection: "row",
    //       minHeight: 0,
    //       gap: 20,
    //       borderWidth: 10,
    //       borderColor: "red",
    //       // backgroundColor: "red",
    //       // height: 60,
    //       justifyContent: "center",
    //       alignItems: "center",
    //       position: "absolute",
    //       // backgroundColor: "white",
    //       overflow: "hidden",
    //     },
    //     tabBarIconStyle: {
    //       // padding: 10, // Ajuste le padding autour de l'icône pour chaque onglet
    //       // padding: 0,
    //       // margin: 0,
    //     },
    //   }}
    // >
    //   <Tabs.Screen
    //   name="index"
    //   options={{
    //     title: "Home",
    //     tabBarIcon: ({ color }) => <House size={24} color={color} />,
    //   }}
    // />
    // </Tabs>
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTab {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
        }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          title: "Statistiques",
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: "Défis",
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: "Conseils",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bottom_tab: {
    width: "100%",
    position: "absolute",
    bottom: 20,
    alignItems: "center",
  },
  bottom_tab_icons: {
    flexDirection: "row",
    width: "70%",
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingHorizontal: 35,
    paddingVertical: 20,
    borderRadius: 30,
    borderWidth: 2,
  },
});
