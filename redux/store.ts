import { configureStore } from "@reduxjs/toolkit";
import sensorsReducer from "./slices/sensorsSlice";

export const store = configureStore({
  reducer: { sensorsReducer },
});
