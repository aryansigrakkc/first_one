import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slice/categorySlice";
import blogReducer from "./slice/blogSlice";
import userReducer from "./slice/userSlice"; 

const store = configureStore({
  reducer: {
    category: categoryReducer,
    blog: blogReducer,
    user: userReducer,
  },
});

export default store;
