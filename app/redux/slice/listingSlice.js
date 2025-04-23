import { createSlice } from "@reduxjs/toolkit";

const listingSlice = createSlice({
  name: "listing",

  initialState: {
    isOpen: false,
  },

  reducers: {
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setIsOpen } = listingSlice.actions;

export default listingSlice.reducer;
