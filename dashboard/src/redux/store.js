import { configureStore } from "@reduxjs/toolkit";
 import blogSlice from "./slice/blogSlice";
import categorySlice from "./slice/categorySlice";
 import userSlice from "./slice/userSlice";






const store=configureStore({
    reducer:{
       blog:blogSlice,
       category:categorySlice,
     user:userSlice
       


    }
})
export default store;