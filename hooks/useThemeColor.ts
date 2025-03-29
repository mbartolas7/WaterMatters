/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export function useThemeColor() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return theme;
}
