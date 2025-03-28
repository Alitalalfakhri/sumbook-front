import { configureStore } from '@reduxjs/toolkit';  
import userReducer from '../features/user/userSlice';  
import urlReducer from '../features/generals/urlSlice';  import booksReducer from '../features/generals/booksSlice';  
const store = configureStore({
  reducer: {
    user: userReducer,  
    url: urlReducer,
    books: booksReducer,
  },
});

export default store;
