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
    },
    { size: 0 },
    {
      size: 1,
      type: "current",
    },
    {
      size: 1,
      type: "current",
    },
    {
      size: 2,
      type: "logs",
    },
  ] as WidgetProps[],
  reducers: {
    setWidgets: (state: WidgetProps[], action) => {
      return action.payload;
    },
    removeWidget: (state: WidgetProps[], action) => {
      return state.filter((item) => item.id !== action.payload);
    },
    addWidget: (state: WidgetProps[], action) => {
      return state.push(action.payload);
    },
  },
});

export const { setWidgets, removeWidget, addWidget } = widgetsSlice.actions;

export const getWidgets = (state: any) => state.widgetsReducer;

export default widgetsSlice.reducer;
