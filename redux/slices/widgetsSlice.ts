import { createSlice } from "@reduxjs/toolkit";

interface WidgetProps {
  name: string;
  room: string;
  id: number;
  key: string;
  size: number;
  type: string;
  config: {
    mode?: string;
  };
}

export const widgetsSlice = createSlice({
  name: "widgets",
  initialState: [
    {
      size: 2,
      type: "chart",
      config: {
        mode: "week",
      },
      id: 0,
    },
    { size: 0 },
    // {
    //   size: 1,
    //   type: "current",
    //   id: 2,
    // },
    {
      size: 2,
      type: "logs",
      id: 3,
    },
    { size: 0 },
    {
      size: 1,
      type: "current",
      id: 1,
    },
    // {
    //   size: 2,
    //   type: "goal",
    //   id: 4,
    // },
    // { size: 0 },
  ] as WidgetProps[],
  reducers: {
    setWidgets: (state: WidgetProps[], action) => {
      return action.payload;
    },
    removeWidget: (state: WidgetProps[], action) => {
      const id = action.payload;
      let widget_index = state.findIndex((item) => item.id == id);

      const { size } = state[widget_index];

      let next_state = state;

      const state_length = state.length;

      if (size == 2) {
        if (widget_index !== state_length - 1) {
          // Delete the size = 0 item after the size = 2 widget
          next_state.splice(widget_index, 2);
        } else {
          next_state.splice(widget_index, 1);
        }
      } else {
        if (
          widget_index !== state_length - 1 &&
          next_state[widget_index + 1].size == 0
        ) {
          console.log(1);
          next_state.splice(widget_index, 2);
        } else if (
          widget_index >= 2 &&
          ((next_state[widget_index - 1].size == 0 &&
            next_state[widget_index - 2].size == 1) ||
            (next_state[widget_index - 1].size == 0 &&
              next_state[widget_index - 2].size == 0))
        ) {
          console.log(2);
          next_state.splice(widget_index - 2, 2);
          next_state[widget_index - 2] = { size: 0 };
        } else if (
          widget_index == 1 &&
          next_state[widget_index - 1].size == 0
        ) {
          console.log(3);
          next_state.splice(0, 2);
        } else {
          console.log(4);
          next_state[widget_index] = { size: 0 };
        }
      }
      return next_state;
    },
    addWidget: (state: WidgetProps[], action) => {
      let item = action.payload;

      if (
        item.config.from !== undefined ||
        item.config.deadline !== undefined
      ) {
        if (typeof item.config.from !== "string") {
          item.config.from = item.config.from.toISOString();
        }

        if (typeof item.config.deadline !== "string") {
          item.config.deadline = item.config.deadline.toISOString();
        }
      }

      // ATTENTION : ici élém. pas encore ajouté, donc state.length - 1 = l'élément avant celui que l'on va ajouter !!

      if (state.length >= 2) {
        if (
          item.size == 1 &&
          state[state.length - 1].size == 0 &&
          state[state.length - 2].size == 1
        ) {
          state.pop();
        }
      }

      state.push(item);

      // ATTENTION : ici élém. déjà ajouté, donc state.length - 1 = l'élément ajouté !!

      if (item.size == 2) {
        state.push({ size: 0 });
      } else if ((state.length - 1) % 2 == 0) {
        // Nombre pair -> donc nouveau widget size = 1 dans colonne de gauche, ajouter un size = 0 à droite tant qu'un nouveau size = 1 ne revient pas direct
        state.push({ size: 0 });
      }
    },
  },
});

export const { setWidgets, removeWidget, addWidget } = widgetsSlice.actions;

export const getWidgets = (state: any) => state.widgetsReducer;

export const getAllAvailableWidgets = () => {
  const all_widgets = [
    {
      size: 2,
      type: "chart",
      config: {
        mode: "week",
      },
    },
    {
      size: 2,
      type: "logs",
    },
    {
      size: 1,
      type: "current",
    },
    {
      size: 1,
      type: "goal",
    },
  ];

  return all_widgets;
};

export default widgetsSlice.reducer;
