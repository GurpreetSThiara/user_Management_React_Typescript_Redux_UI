// src/redux/store.ts
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import { apiSlice } from "./api/apiSlice";
import usersStore from "./slices/users";

const rootReducer = {
  [userSlice.reducerPath]: userSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [usersStore.reducerPath] : usersStore.reducer
};

export const reduxStore = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
