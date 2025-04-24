import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    user: null,
    isInitializing: true,
    products: [],
    claims: [],
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
    setClaims: (state, action) => {
      state.claims = action.payload;
    },
  },
});

export const { setUser, setIsInitializing, setProducts, setClaims } =
  userSlice.actions;

export default userSlice.reducer;
