// import {
//   FlatList,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { Cog, PencilLine } from "lucide-react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import { useThemeColor } from "@/hooks/useThemeColor";
// import { router, useNavigation } from "expo-router";
// import WidgetListItem from "@/components/WidgetListItem";
// import ButtonContainer from "@/components/button/ButtonContainer";

// export default function HomeScreen() {
//   const insets = useSafeAreaInsets();
//   const theme = useThemeColor();

//   const navigation = useNavigation();

//   const handleNavigateToSettings = () => {};

//   const widgets = [
//     {
//       size: 2,
//       type: "chart",
//       config: {},
//     },
//     { size: 0 },
//     {
//       size: 1,
//       type: "goal",
//       config: {},
//     },
//     {
//       size: 1,
//       type: "current",
//     },
//     {
//       size: 2,
//       type: "logs",
//     },
//     { size: 0 },
//     {
//       size: 2,
//       type: "logs",
//     },
//     { size: 0 },
//     {
//       size: 2,
//       type: "logs",
//     },
//     { size: 0 },
//     {
//       size: 1,
//       type: "goal",
//       config: {},
//     },
//     {
//       size: 1,
//       type: "goal",
//       config: {},
//     },
//     {
//       size: 2,
//       type: "logs",
//     },
//   ] as const;

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           backgroundColor: theme.bg,
//           paddingTop: insets.top,
//         },
//       ]}
//     >
//       <View style={styles.header}>
//         <Text style={[styles.header_title, { color: theme.dark_text }]}>
//           Bonjour Mathias 👋
//         </Text>
//         <TouchableOpacity onPress={handleNavigateToSettings}>
//           <Cog color={theme.dark_text} />
//         </TouchableOpacity>
//       </View>
//       <FlatList
//         // Vertical gap
//         contentContainerStyle={{ gap: 10 }}
//         // Horizontal gap
//         columnWrapperStyle={{ gap: 10 }}
//         data={widgets}
//         numColumns={2}
//         style={styles.main}
//         renderItem={({ item, index }) =>
//           item.size == 0 ? <></> : <WidgetListItem {...item} key={index} />
//         }
//         ListFooterComponent={() => (
//           <ButtonContainer action={() => router.push("/modal")}>
//             <View
//               style={[
//                 styles.button,
//                 {
//                   borderColor: theme.stroke,
//                   backgroundColor: theme.light_text,
//                 },
//               ]}
//             >
//               <PencilLine color={theme.dark_text} />
//               <Text style={[styles.button_text, { color: theme.dark_text }]}>
//                 Personaliser les widgets
//               </Text>
//             </View>
//           </ButtonContainer>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 15,
//   },

//   header: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 30,
//     marginBlock: 25,
//   },
//   header_title: {
//     fontFamily: "Figtree-SemiBold",
//     fontSize: 24,
//     letterSpacing: -0.4,
//   },

//   main: {
//     width: "100%",
//   },

//   button: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 15,
//     borderWidth: 2,
//     borderRadius: 30,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     width: "auto",
//     alignSelf: "center",
//   },
//   button_text: {
//     fontFamily: "Figtree-Medium",
//     fontSize: 16,
//     letterSpacing: -0.4,
//   },
// });

import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const DraggableBox = ({ id, color }: any) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      console.log(event.translationX);
      console.log(event.translationY);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0); // Réinitialise à la position initiale
      translateY.value = withSpring(0); // Réinitialise à la position initial
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[styles.box, animatedStyle, { backgroundColor: color }]}
      />
      {/* <Text>tttt</Text> */}
    </GestureDetector>
    // <Text>test</Text>
  );
};

export default function App() {
  const items = [
    { id: 1, color: "red" },
    { id: 2, color: "blue" },
    { id: 3, color: "green" },
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={items}
        style={{
          paddingTop: 100,
          backgroundColor: "grey",
          width: "100%",
          height: "100%",
          // flex: 1,
        }}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <DraggableBox key={item.id} id={item.id} color={item.color} />
          // <Text>tttt</Text>
        )}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 20,
    // position: "absolute",
  },
});
