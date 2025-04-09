import React from "react";
import { Tabs } from "expo-router";

import { useColorScheme } from "@/hooks/useColorScheme";
import BottomTab from "@/components/navigation/BottomTab";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
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
