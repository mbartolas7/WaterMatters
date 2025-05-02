import { useThemeColor } from "@/hooks/useThemeColor";

const tint = "#0660FB";
const light_bg = "#fff";

const pie_sample_data = [
  { value: 33, color: tint },
  { value: 66, color: light_bg },
];

const bar_sample_data = [
  { value: 96, label: "L" },
  { value: 94, label: "M" },
  { value: 95, label: "M" },
  { value: 90, label: "J" },
  { value: 98, label: "V" },
  { value: 100, label: "S" },
  { value: 95, label: "D" },
];

const current_sample_data = [
  {
    room: "Salle de bain",
    name: "Douche",
  },
  {
    room: "Cuisine",
    name: "Évier",
  },
];

const logs_sample_data = [
  {
    room: "Salle de bain",
    name: "Lavabos",
    duration: 360,
    volume: 10,
  },
  {
    room: "Cuisine",
    name: "Évier",
    duration: 200,
    volume: 2,
  },
  {
    room: "Salle de bain",
    name: "Lavabos",
    duration: 225,
    volume: 3,
  },
];

export {
  pie_sample_data,
  bar_sample_data,
  current_sample_data,
  logs_sample_data,
};
