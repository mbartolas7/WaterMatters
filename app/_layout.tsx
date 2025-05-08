import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColorScheme } from "@/hooks/useColorScheme";

import { ShowBottomTabProvider } from "@/contexts/ShowBottomTabContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { store } from "@/redux/store";
import { Provider } from "react-redux";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Figtree: require("../assets/fonts/Figtree-Medium.ttf"),
    "Figtree-light": require("../assets/fonts/Figtree-Light.ttf"),
    "Figtree-regular": require("../assets/fonts/Figtree-Regular.ttf"),
    "Figtree-semibold": require("../assets/fonts/Figtree-SemiBold.ttf"),
    "Figtree-bold": require("../assets/fonts/Figtree-Bold.ttf"),
    "Figtree-extrabold": require("../assets/fonts/Figtree-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Provider store={store}>
          <BottomSheetModalProvider>
            <ShowBottomTabProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen
                  name="(modals)/widgets"
                  options={{
                    presentation: "modal",
                    headerShown: false,
                  }}
                />
              </Stack>
              <StatusBar style="auto" />
            </ShowBottomTabProvider>
          </BottomSheetModalProvider>
        </Provider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
