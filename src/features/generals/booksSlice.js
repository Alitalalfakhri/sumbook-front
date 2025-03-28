import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: [],
  
};


const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers:{
    loadBooks:(state,action) => {
      state.books = action.payload
    }
  }
})


export const {loadBooks} = booksSlice.actions;

export default booksSlice.reducer;