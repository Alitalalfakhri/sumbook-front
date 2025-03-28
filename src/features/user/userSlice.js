import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  uid:"",
  type:"",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state , action) => {
      state.loggedIn = true;
      state.uid = action.payload.uid;
      state.type = action.payload.type;
      
    },
    logout: (state) => {
      state.loggedIn = false;
      state.uid = null; // Reset uid on logout
      state.type = ""; // Reset type on logout
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;