import { StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

import ButtonContainer from "./button/ButtonContainer";

interface FilterProps {
  id: string;
  name: string;
  selected: boolean;
  handleSelectFilter: (filter: string) => void;
}

export default function FilterListItem(props: FilterProps) {
  const { id, name, selected, handleSelectFilter } = props;

  const theme = useThemeColor();

  return (
    <ButtonContainer action={() => handleSelectFilter(id)}>
      <View
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
      </View>
    </ButtonContainer>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 12,
    overflow: "hidden", // Ajoute ceci
  },
  item_text: {
    fontSize: 16,
    letterSpacing: -0.4,
  },
});
