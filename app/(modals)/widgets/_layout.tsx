import ButtonContainer from "@/components/button/ButtonContainer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { BlurView } from "expo-blur";
import { Stack, useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

export default function WidgetsModalLayout() {
  const router = useRouter();
  const theme = useThemeColor();

  const header = () => (
    <View style={[styles.header]}>
      <BlurView
        style={[styles.blur, { borderColor: theme.stroke }]}
        intensity={50}
        tint={"default"}
      >
        <ButtonContainer action={() => router.dismissTo("/")}>
          <X color={theme.dark_text} strokeWidth={2.25} />
        </ButtonContainer>
      </BlurView>
    </View>
  );

  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // navigation horizontale entre les pages
        // headerShown: false,
        header: () => header(),
        headerTransparent: true,
        gestureEnabled: false,
      }}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    position: "absolute",
    left: 0,
    top: 0,
  },
  blur: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
