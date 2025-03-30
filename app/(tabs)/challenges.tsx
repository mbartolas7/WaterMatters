import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Trophy } from "lucide-react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useState } from "react";
import FilterListItem from "@/components/FilterListItem";
import ChallengeListItem from "@/components/ChallengeListItem";

// interface FilterProps {
//   id: String;
//   name: string;
//   selected: boolean;
//   setSelectedFilter: React.Dispatch<React.SetStateAction<String>>; // Le type pour setSelectedFilter
// }

interface ChallengeProps {
  title: String;
  description: String;
  progression: number;
  success_dat?: EpochTimeStamp;
}

export default function ChallengesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();

  const [selectedFilter, setSelectedFilter] = useState<String>("all");

  const [challenges, setChallenges] = useState<ChallengeProps[]>([]);

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

  useEffect(() => {
    setChallenges(challenges_data);
  }, []);

  const handleSelectFilter = (filter: String) => {
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

    console.log(next_data);

    setChallenges(next_data);
    setSelectedFilter(filter);
  };

  const headerComponent = () => {
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
        <ScrollView
          horizontal
          contentContainerStyle={{ gap: 8 }}
          style={styles.list_filters}
        >
          {filters_data.map((filter, index) => (
            <FilterListItem
              {...filter}
              key={index}
              selected={selectedFilter == filter.id}
              handleSelectFilter={handleSelectFilter}
            />
          ))}
        </ScrollView>
      </View>
    );
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
      <View style={styles.header}>
        <Text style={[styles.header_title, { color: theme.dark_text }]}>
          Défis
        </Text>
      </View>

      <FlatList
        style={styles.list_challenges}
        data={challenges}
        ListHeaderComponent={headerComponent}
        contentContainerStyle={{ gap: 6, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChallengeListItem key={index} {...item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBlock: 25,
  },
  header_title: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 24,
    letterSpacing: -0.4,
  },

  header_component: {
    gap: 20,
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

  list_filters: {
    marginBottom: 10,
    width: Dimensions.get("window").width,
    marginLeft: -15,
    paddingLeft: 15,
  },

  list_challenges: {
    flex: 1,
    width: Dimensions.get("window").width,
    marginLeft: -15,
    paddingHorizontal: 15,
  },
});
