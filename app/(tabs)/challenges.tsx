import { useCallback, useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Trophy } from "lucide-react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

import { useThemeColor } from "@/hooks/useThemeColor";

import ChallengeListItem from "@/components/ChallengeListItem";
import FilterList from "@/components/FilterList";

interface ChallengeProps {
  title: string;
  description: string;
  progression: number;
  success_date?: EpochTimeStamp;
}

const filters_data = [
  {
    name: "Tous",
    id: "all",
  },
  {
    name: "Réalisés",
    id: "realized",
  },
  {
    name: "En cours",
    id: "in_progress",
  },
];

const challenges_data = [
  {
    title: "Économiseur d’eau I",
    description:
      "Ceci est le premier challenge à réaliser. Il consiste en quelque chose qui sera défini plus tard.",
    progression: 100,
    success_date: 1743347847000,
  },
  {
    title: "Économiseur d’eau II",
    description: "Ceci est le second challenge à réaliser.",
    progression: 67,
    success_date: undefined,
  },
  {
    title: "Économiseur d’eau III",
    description: "Ceci est le troisème challenge à réaliser.",
    progression: 0,
    success_date: undefined,
  },
  {
    title: "Water Master I",
    description:
      "Ceci est le troisième challenge à réaliser. Il consiste en quelque chose qui sera défini plus tard.",
    progression: 100,
    success_date: 1740925047000,
  },
  {
    title: "Water Master II",
    description:
      "Ceci est le quatrième challenge à réaliser. Il est en cours de réalisation.",
    progression: 100,
    success_date: 1740838647000,
  },
];

const challenge_descriptions = {
  express_shower: "Description douche",
  water_master_1: "Description wm1",
  water_master_2: "Description wm2",
  water_master_3: "Description wm3",
  streak: "Description Streak",
  // {
  //   key: "express_shower",
  //   description: "Description douche"
  // },
  // {
  //   key: "water_master_1",
  //   description: "Description wm1"
  // },
  // {
  //   key: "water_master_2",
  //   description: "Description wm2"
  // },
  // {
  //   key: "water_master_3",
  //   description: "Description wm3"
  // },
};

interface ChallengeProps {
  success?: boolean;
  last_checked?: FirebaseFirestoreTypes.Timestamp;
  active?: boolean;
  longest_streak?: number;
  streak?: number;
  total_day_volume?: number;
  average_duration?: number;
  count?: number;
  key: string;
  description: string;
}

const challengesCollection = firestore().collection("challenges");

export default function ChallengesScreen() {
  const [headerHeight, setHeaderHeight] = useState(0);

  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const [challenges, setChallenges] = useState<ChallengeProps[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const scrollY = useSharedValue(0);

  const insets = useSafeAreaInsets();
  const theme = useThemeColor();

  useEffect(() => {
    // setChallenges(challenges_data);
    getData();
  }, []);

  const getData = async () => {
    await challengesCollection.get().then((querySnapshot) => {
      const data = [] as ChallengeProps[];
      querySnapshot.forEach((documentSnapshot) => {
        const doc_data = documentSnapshot.data() as Omit<ChallengeProps, "key">;
        const key = documentSnapshot.id;
        data.push({
          ...doc_data,
          key: key,
          description: challenge_descriptions[key]
            ? challenge_descriptions[key]
            : "",
        });
      });

      setChallenges(data);
      setLoading(false);
    });
  };

  const handleApplyFilter = (filter: string) => {
    let next_data = challenges_data;

    switch (filter) {
      case "all":
        break;
      case "realized":
        next_data = next_data.filter((item) => item.progression == 100);
        break;
      case "in_progress":
        next_data = next_data.filter((item) => item.progression < 100);
        break;
      default:
        break;
    }

    setChallenges(next_data);
    setSelectedFilter(filter);
  };

  const headerAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(scrollY.value > 50 ? 0 : 1, {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      }),
      transform: [
        {
          translateY: withTiming(scrollY.value > 50 ? -40 : 0),
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

  const headerComponent = useCallback(() => {
    return (
      <View style={styles.header_component}>
        <View style={styles.card}>
          <LinearGradient
            colors={[theme.tint, theme.dark_tint]}
            style={styles.card_gradient}
            start={{ x: 0, y: 0 }}
          >
            <View style={styles.card_gradient_left}>
              <Text
                style={[
                  styles.card_gradient_left_title,
                  { color: theme.light_text },
                ]}
              >
                Mathias
              </Text>
              <View style={styles.card_gradient_left_text}>
                <Text style={styles.card_gradient_left_text_line}>
                  <Text style={styles.card_gradient_left_text_line_bold}>
                    x/x
                  </Text>{" "}
                  défis réalisés
                </Text>
                <Text style={styles.card_gradient_left_text_line}>
                  <Text style={styles.card_gradient_left_text_line_bold}>
                    x
                  </Text>{" "}
                  points
                </Text>
              </View>
            </View>

            <View style={styles.card_gradient_right}>
              <Trophy color={theme.light_text} size={104} strokeWidth={1.5} />
            </View>
          </LinearGradient>
        </View>
        <FilterList
          filters={filters_data}
          handleApplyFilter={handleApplyFilter}
          default_filter="all"
        />
      </View>
    );
  }, []);

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
        <Text style={[styles.header_title, { color: theme.dark_text }]}>
          Défis
        </Text>
      </Animated.View>

      {headerHeight !== 0 && (
        <Animated.FlatList
          style={[styles.main, { paddingTop: headerHeight }]}
          data={challenges}
          ListHeaderComponent={headerComponent}
          contentContainerStyle={{ gap: 6, paddingBottom: 120, paddingTop: 15 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ChallengeListItem key={index} {...item} />
          )}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 10,
    position: "absolute",
    zIndex: 9999,
    paddingHorizontal: 15,
  },
  header_title: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 24,
    letterSpacing: -0.4,
  },

  header_component: {
    gap: 15,
  },

  card: {
    width: "100%",
    height: "auto",
  },
  card_gradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 15,
  },
  card_gradient_left: {
    flexDirection: "column",
    gap: 80,
    padding: 10,
  },
  card_gradient_left_title: {
    fontFamily: "Figtree-Bold",
    fontSize: 30,
    letterSpacing: -0.4,
  },
  card_gradient_left_text: {},
  card_gradient_left_text_line: {
    fontFamily: "Figtree-Regular",
    fontSize: 20,
    letterSpacing: -0.4,
    color: "white",
  },
  card_gradient_left_text_line_bold: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 22,
  },
  card_gradient_right: {
    justifyContent: "flex-end",
    padding: 5,
  },

  main: {
    flex: 1,
    width: Dimensions.get("window").width,
    marginLeft: -15,
    paddingHorizontal: 15,
  },
});
