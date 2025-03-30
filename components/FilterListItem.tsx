import { useThemeColor } from "@/hooks/useThemeColor";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";

interface FilterProps {
  id: String;
  name: string;
  selected: boolean;
  handleSelectFilter: (filter: String) => void;
}

export default function FilterListItem(props: FilterProps) {
  const { id, name, selected, handleSelectFilter } = props;

  const theme = useThemeColor();

  const filter_scale = useAnimatedValue(1);

  const handlePressIn = () => {
    Animated.spring(filter_scale, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();

    Haptics.selectionAsync();
  };

  const handlePressOut = () => {
    Animated.spring(filter_scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      handleSelectFilter(id);
    }, 300);
  };

  return (
    <Animated.View style={{ transform: [{ scale: filter_scale }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.item,
          {
            borderColor: theme.stroke,
            backgroundColor: selected ? theme.tint : theme.bg,
          },
        ]}
      >
        <Text
          style={[
            styles.item_text,
            {
              color: selected ? theme.light_text : theme.secondary_text,
              fontFamily: selected ? "Figtree-SemiBold" : "Figtree-Medium",
            },
          ]}
        >
          {name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 12,
  },
  item_text: {
    fontSize: 16,
    letterSpacing: -0.4,
  },
});
