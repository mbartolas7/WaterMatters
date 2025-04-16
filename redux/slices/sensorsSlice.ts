import { createSlice } from "@reduxjs/toolkit";

interface SensorProps {
  name: string;
  room: string;
  id: number;
  key: string;
}

export const sensorsSlice = createSlice({
  name: "sensors",
  initialState: [] as SensorProps[],
  reducers: {
    setSensors: (state: SensorProps[], action) => {
      return action.payload;
    },
  },
});

export const { setSensors } = sensorsSlice.actions;

export const getSensors = (state: any) => state.sensorsReducer;

export default sensorsSlice.reducer;
