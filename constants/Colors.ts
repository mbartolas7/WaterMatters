/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const water_matters_blue = "#0660FB";
const water_matters_dark_blue = "#004ED5";
const stroke_grey = "#F1F2F6";
const bg_grey = "#F7F7F7";

export const Colors = {
  light: {
    light_text: "#fff",
    dark_text: "#000",
    secondary_text: "#909090",
    stroke: stroke_grey,
    bg: bg_grey,

    tint: water_matters_blue,
    dark_tint: water_matters_dark_blue,

    tab_icon_default: "#909090",
    tab_icon_selected: "#000",

    blur_tint: "systemUltraThinMaterialDark",
  },
  dark: {
    light_text: "#fff",
    dark_text: "#000",
    secondary_text: "#909090",
    stroke: stroke_grey,
    bg: bg_grey,

    tint: water_matters_blue,
    dark_tint: water_matters_dark_blue,

    tab_icon_default: "#909090",
    tab_icon_selected: "#000",

    blur_tint: "systemUltraThinMaterialLight",
  },
};
