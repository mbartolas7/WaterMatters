import React from "react";
import { Animated, Pressable, useAnimatedValue } from "react-native";
import * as Haptics from "expo-haptics";

interface ButtonContainerProps {
  children: React.ReactNode;
  action: any;
}

export default function ButtonContainer({
  children,
  action,
  ...restProps
}: ButtonContainerProps) {
  const button_scale = useAnimatedValue(1);

  const handlePressIn = () => {
    Animated.spring(button_scale, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();

    Haptics.selectionAsync();
  };

  const handlePressOut = () => {
    Animated.spring(button_scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={action}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...restProps}
    >
      <Animated.View style={{ transform: [{ scale: button_scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
