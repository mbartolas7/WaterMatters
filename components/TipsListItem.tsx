import { useThemeColor } from "@/hooks/useThemeColor";
import { MoveUpRight } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TipsListItemProps {
  title: string;
  description: string;
  progression: number;
  success_date?: EpochTimeStamp;
}

export default function TipsListItem({ item }: { item: TipsListItemProps }) {
  const { title, description, icon } = item;

  const theme = useThemeColor();

  return (
    <View style={[styles.item, { borderColor: theme.stroke }]}>
      <View style={styles.icon}>{icon}</View>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.dark_text }]}>
            {title}
          </Text>
          <TouchableOpacity style={styles.link}>
            <Text style={[styles.link_text, { color: theme.tint }]}>
              Acheter l'article
            </Text>
            <View style={styles.link_icon}>
              <MoveUpRight size={17} color={theme.tint} />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={[styles.description, { color: theme.dark_text }]}>
          {description}
        </Text>
        {/* <TouchableOpacity style={styles.link}>
          <Text style={[styles.link_text, { color: theme.tint }]}>
            Acheter l'article
          </Text>
          <View style={styles.link_icon}>
            <MoveUpRight size={17} color={theme.tint} />
          </View>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    flexDirection: "row",
    gap: 20,
  },

  icon: {
    justifyContent: "center",
    alignItems: "center",
  },

  main: {
    gap: 5,
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  title: {
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    letterSpacing: -0.4,
    lineHeight: 20,
    flex: 1,
    textAlign: "left",
  },
  description: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -0.4,
  },

  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  link_text: {
    fontFamily: "Figtree-SemiBold",
    fontSize: 14,
  },
  link_icon: {
    bottom: -1.5,
  },

  section: {
    gap: 8,
    width: "100%",
  },

  section_header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  section_main: {
    gap: 2,
  },

  section_current_item: {
    gap: 2,
  },

  section_header_title: {
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    letterSpacing: -0.4,
    lineHeight: 20,
    flex: 1,
  },
  section_text: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -0.4,
  },
  section_bold_text: {
    fontFamily: "Figtree-Bold",
  },
  section_secondary_text: {
    fontFamily: "Figtree-Regular",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.4,
  },
});
