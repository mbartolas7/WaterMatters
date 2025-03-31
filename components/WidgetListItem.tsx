import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

interface WidgetProps {
  size: 1 | 2;
  //   size: number;
  type: "chart" | "goal" | "current" | "logs";
  //   type: string;
  config?: object;
  key: number;
}

export default function WidgetListItem(props: WidgetProps) {
  const { size, type, config } = props;

  //   useEffect(() => {
  //     // console.log(typeof )
  //     // console.log(props);
  //     const arr = Object.values(props);
  //     console.log(arr);

  //     arr.map((item) => {
  //       console.log(typeof item);
  //     });
  //   });

  return (
    <View style={styles.item}>
      <Text>
        {size} : {type}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "grey",
  },
});
