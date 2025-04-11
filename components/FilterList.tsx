import { useState } from "react";

import FilterListItem from "./FilterListItem";
import { Dimensions, ScrollView, StyleSheet } from "react-native";

interface FilterProps {
  name: string;
  id: string;
}

interface FilterListProps {
  handleApplyFilter: (filter: string) => void;
  filters: Array<FilterProps>;
  default_filter: string;
}

export default function FilterList({
  handleApplyFilter,
  filters,
  default_filter,
}: FilterListProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>(default_filter);

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ gap: 8 }}
      style={styles.list}
    >
      {filters.map((filter, index) => {
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
