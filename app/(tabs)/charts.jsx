import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChartsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingTop: insets.top }}>
      <Text>Mon écran</Text>
    </View>
  );
}
