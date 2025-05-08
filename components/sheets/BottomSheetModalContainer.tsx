import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, {
  forwardRef,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";

interface BottomSheetModalContainerProps {
  children: React.ReactNode;
  footer?: ReactElement<any, any>;
  footer_dependencies?: any;
  snap_points: Array<string>;
  title: string;
  input_ref?: React.RefObject<TextInput>;
  onAnimate: (actual_index: number, next_index: number) => void;
}

const BottomSheetModalContainer = forwardRef(
  (
    {
      children,
      footer,
      footer_dependencies,
      snap_points,
      title,
      onAnimate,
      input_ref,
      ...restProps
    }: BottomSheetModalContainerProps,
    ref: any
  ) => {
    const { dismiss, dismissAll } = useBottomSheetModal();

    const [isShown, setIsShown] = useState(false);

    const theme = useThemeColor();

    const bottom_sheet_ref = useRef<BottomSheetModal>(ref);

    // Insets of the SafeAreaView, used for the bottom margin of the footer component
    const insets = useSafeAreaInsets();

    const handleShowBottomSheet = useCallback(() => {
      // Show the bottom sheet
      bottom_sheet_ref.current?.present();
    }, [ref]);

    const handleCollapseBottomSheet = () => {
      bottom_sheet_ref.current?.collapse();
    };

    useImperativeHandle(ref, () => ({
      // Use the functions from parents components
      handleCollapseBottomSheet: () => {
        handleCollapseBottomSheet();
      },
      toggleShowBottomSheet: () => {
        if (isShown) {
          dismiss();
        } else {
          handleShowBottomSheet();
        }
      },
    }));

    const header = () => (
      // Header of the bottom sheet
      <TouchableWithoutFeedback
        onPress={() => (input_ref ? input_ref.current?.blur() : null)}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity style={styles.close} onPress={() => dismiss()}>
            <X color={theme.dark_text} />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          onPress={() => dismissAll()}
        />
      ),
      []
    );

    const renderFooter = useCallback(
      (props: any) => (
        <TouchableWithoutFeedback
          onPress={() => (input_ref ? input_ref.current?.blur() : null)}
        >
          <BottomSheetFooter
            {...props}
            style={[styles.footer_container]}
            bottomInset={0}
          >
            <LinearGradient
              //   "rgba(255,255,255,0)"
              colors={["rgba(255,255,255,0)", "white"]}
              // style={styles.card_gradient}
              style={[
                styles.footer_container_gradient,
                { paddingBottom: insets.bottom },
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 0.3 }}
            >
              {footer}
            </LinearGradient>
          </BottomSheetFooter>
        </TouchableWithoutFeedback>
      ),
      // Dependencies in order to rerender the footer on change
      footer_dependencies
    );

    const snapPoints = useMemo(() => snap_points, []);

    return (
      <BottomSheetModal
        containerStyle={{ zIndex: 9999, elevation: 9999 }}
        stackBehavior="replace"
        detached={true}
        keyboardBehavior="extend"
        // keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustPan"
        ref={bottom_sheet_ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        handleComponent={header}
        backdropComponent={renderBackdrop}
        footerComponent={footer !== undefined ? renderFooter : undefined}
        onChange={(index) => {
          setIsShown(index !== -1);
        }}
        {...restProps}
      >
        {children}
      </BottomSheetModal>
    );
  }
);

export default BottomSheetModalContainer;

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 12,
    marginTop: 16,
    marginHorizontal: 20,
  },
  title: {
    textAlign: "center",
    fontFamily: "Figtree-Bold",
    fontSize: 20,
    letterSpacing: -0.4,
  },
  close: {
    position: "absolute",
    right: 0,
    bottom: -2,
  },

  footer_container: {
    gap: 14,
    justifyContent: "space-between",
  },
  footer_container_gradient: {
    flex: 1,
    paddingTop: 35,
  },
});
