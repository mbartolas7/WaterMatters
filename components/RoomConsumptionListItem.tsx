import { Text } from "react-native";

// interface RoomConsumptionProps {
//     item:
//     index: number
// }

export default function RoomConsumptionListItem({
  item,
  index,
}: RoomConsumptionProps) {
  return <Text>{index}</Text>;
}
