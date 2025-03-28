import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  useAnimatedValue,
} from "react-native";
import { House, ChartColumn, Trophy, BookMarked } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";

export default function BottomTabButton({ route, actual, index, navigation }) {
  const colorScheme = useColorScheme();

  const icon_scale = useAnimatedValue(1);

  const is_focused = index == actual;

  const label = () => {
    const color =
      Colors[colorScheme ?? "light"][
        is_focused ? "tabIconSelected" : "tabIconDefault"
      ];
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
    if (is_focused) {
      Animated.spring(icon_scale, {
        toValue: 1.2,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(icon_scale, {
        toValue: 1.2,
        useNativeDriver: true,
      }).start();
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
      // disabled={is_focused}
      activeOpacity={1}
    >
      <Animated.View
        style={[styles.icon, { transform: [{ scale: icon_scale }] }]}
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
