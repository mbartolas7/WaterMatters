import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  useAnimatedValue,
} from "react-native";
import { House, ChartColumn, Trophy, BookMarked } from "lucide-react-native";
import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs";
import {
  NavigationHelpers,
  NavigationRoute,
  ParamListBase,
} from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useThemeColor } from "@/hooks/useThemeColor";

interface BottomTabButtonProps {
  route: NavigationRoute<ParamListBase, string>;
  actual: Number;
  index: Number;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}

export default function BottomTabButton({
  route,
  actual,
  index,
  navigation,
}: BottomTabButtonProps) {
  const theme = useThemeColor();

  const icon_scale = useAnimatedValue(1);
  const icon_rotate = useAnimatedValue(0);

  const is_focused = index == actual;

  const label = () => {
    const color = theme[is_focused ? "tab_icon_selected" : "tab_icon_default"];
    switch (route.name) {
      case "index":
        return <House color={color} />;
        break;
      case "charts":
        return <ChartColumn color={color} />;
        break;
      case "challenges":
        return <Trophy color={color} />;
        break;
      case "tips":
        return <BookMarked color={color} />;
        break;
      default:
        return <></>;
        break;
    }
  };

  const handlePressIn = () => {
    Animated.spring(icon_scale, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();

    Haptics.selectionAsync();
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const rotate_anim_duration = 200;
    if (is_focused) {
      Animated.sequence([
        Animated.timing(icon_rotate, {
          toValue: -1,
          duration: rotate_anim_duration / 1.5,
          useNativeDriver: true,
        }),
        Animated.timing(icon_rotate, {
          toValue: 1,
          duration: rotate_anim_duration * 1.5,
          useNativeDriver: true,
        }),
        Animated.timing(icon_rotate, {
          toValue: 0,
          duration: rotate_anim_duration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(icon_scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleNavigate = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (!is_focused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleNavigate}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.icon,
          {
            transform: [
              { scale: icon_scale },
              {
                rotate: icon_rotate.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: ["-8deg", "0deg", "8deg"],
                }),
              },
            ],
          },
        ]}
      >
        {label()}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {
    padding: 5,
  },
});
