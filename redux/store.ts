import { configureStore } from "@reduxjs/toolkit";
import sensorsReducer from "./slices/sensorsSlice";
import widgetsReducer from "./slices/widgetsSlice";

export const store = configureStore({
  reducer: { sensorsReducer, widgetsReducer },
});
