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
    // {
    //   size: 2,
    //   type: "chart",
    //   config: {
    //     mode: "week",
    //   },
    //   id: 0,
    // },
    // { size: 0 },
    // {
    //   size: 1,
    //   type: "current",
    //   id: 1,
    // },
    // {
    //   size: 1,
    //   type: "current",
    //   id: 2,
    // },
    // {
    //   size: 2,
    //   type: "logs",
    //   id: 3,
    // },
    // { size: 0 },
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

      console.log(state[widget_index]);

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
      console.log(next_state);

      return next_state;
    },
    addWidget: (state: WidgetProps[], action) => {
      return state.push(action.payload);
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
