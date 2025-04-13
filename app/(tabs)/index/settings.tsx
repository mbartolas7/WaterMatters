import { useState } from "react";
import { Link, RelativePathString, useRouter } from "expo-router";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import ArrowLeft from "@/components/icon/ArrowLeft";
import ButtonContainer from "@/components/button/ButtonContainer";

import { useThemeColor } from "@/hooks/useThemeColor";

interface SettingProps {
  title: string;
  description: string;
  route_name: RelativePathString;
}

const settings = [
  {
    title: "Système",
    description:
      "Éditez vos différents capteurs et la pièce associée de votre maison",
    route_name: "system" as RelativePathString,
  },
  {
    title: "Notifications",
    description: "Choisissez comment vous désirez être notifié ",
    route_name: "notifications" as RelativePathString,
  },
];

export default function SettingsScreen() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const scrollY = useSharedValue(0);

  const theme = useThemeColor();
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const settingsListItem = (item: SettingProps, index: number) => {
    const { title, description, route_name } = item;
    return (
      <ButtonContainer key={index} action={() => router.navigate(route_name)}>
        <View style={styles.list_item}>
          <Text style={[styles.list_item_title, { color: theme.dark_text }]}>
            {title}
          </Text>
          <Text
            style={[
              styles.list_item_description,
              { color: theme.secondary_text },
            ]}
          >
            {description}
          </Text>
        </View>
      </ButtonContainer>
    );
  };

  const headerAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(scrollY.value > 50 ? -30 : 0),
        },
      ],
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bg,
          paddingTop: insets.top,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.header,
          headerAnimatedStyles,
          { top: insets.top, backgroundColor: theme.bg },
        ]}
        onLayout={handleLayout}
      >
        <Link href="..">
          <ArrowLeft color={theme.dark_text} />
        </Link>
        <Text style={[styles.header_title, { color: theme.dark_text }]}>
          Paramètres
        </Text>
      </Animated.View>

      {headerHeight !== 0 && (
        <Animated.ScrollView
          style={[styles.list, { paddingTop: headerHeight }]}
          contentContainerStyle={{ gap: 12, paddingBottom: 120 }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {settings.map(settingsListItem)}
        </Animated.ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  header: {
    width: Dimensions.get("window").width,
    paddingTop: 30,
    paddingBottom: 10,
    position: "absolute",
    zIndex: 9999,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  header_title: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 24,
    letterSpacing: -0.4,
  },

  list: {
    flex: 1,
    marginTop: 15,
    width: Dimensions.get("window").width,
    marginLeft: -15,
    paddingHorizontal: 15,
  },

  list_item: {
    width: "100%",
    gap: 3,
  },
  list_item_title: {
    fontFamily: "Figtree-Medium",
    fontSize: 18,
    letterSpacing: -0.4,
  },
  list_item_description: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    letterSpacing: -0.4,
    lineHeight: 18,
  },
});
