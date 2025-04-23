"use client";

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/UserSlice.js";
import listingSlice from "./slice/listingSlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
    listing: listingSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
