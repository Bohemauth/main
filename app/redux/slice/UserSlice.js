import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    user: null,
    isInitializing: true,
    products: [],
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsInitializing: (state, action) => {
      state.isInitializing = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setUser, setIsInitializing, setProducts } = userSlice.actions;

export default userSlice.reducer;
