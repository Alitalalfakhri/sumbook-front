import { createSlice } from "@reduxjs/toolkit";

const urlSlice = createSlice({
  name:"serverUrl",
  initialState:{
    url:"https://sumbook-back-production-c036.up.railway.app",
  },

})

export default urlSlice.reducer;
