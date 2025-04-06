import { useState } from "react";

import FilterListItem from "./FilterListItem";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

interface FilterListProps {
  handleApplyFilter: (filter: string) => void;
}

export default function FilterList({ handleApplyFilter }: FilterListProps) {
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
  ] as const;

  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ gap: 8 }}
      style={styles.list}
    >
      {filters_data.map((filter, index) => {
        const { id } = filter;

        const handleSelectFilter = () => {
          setSelectedFilter(id);
          handleApplyFilter(id);
        };

        return (
          <FilterListItem
            {...filter}
            key={index}
            selected={selectedFilter == id}
            handleSelectFilter={handleSelectFilter}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    marginBottom: 5,
    width: Dimensions.get("window").width,
    marginLeft: -15,
    paddingLeft: 15,
    paddingVertical: 5,
  },
});
