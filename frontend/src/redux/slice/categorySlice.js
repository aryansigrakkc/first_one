import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = window.localStorage.getItem("token");

const getCategory = createAsyncThunk("category/get-all-category", async () => {
  const response = await axios.get("http://localhost:9006/api/v1/category/get-category", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

const categorySlice = createSlice({
  name: "category",
  initialState: {
    isLoading: false,
    isError: false,
    data: null,
    message: "",
  },
  extraReducers: (builder) => {
    // Get
    builder.addCase(getCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCategory.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getCategory.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});
export { getCategory };
export default categorySlice.reducer;
