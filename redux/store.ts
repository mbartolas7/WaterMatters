import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

import sensorsReducer from "./slices/sensorsSlice";
import widgetsReducer from "./slices/widgetsSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["sensorsReducer"],
};
const rootReducer = combineReducers({ sensorsReducer, widgetsReducer });

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["register"], // utile selon ton message d'erreur
      },
    }),
});
export const persistor = persistStore(store);
