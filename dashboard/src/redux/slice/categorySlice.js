import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const token = window.localStorage.getItem("token");

// 👉 GET ALL CATEGORIES
const getCategory = createAsyncThunk("category/get-all-category", async () => {
  const response = await axios.get("http://localhost:9006/api/v1/category/get-category", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

// 👉 CREATE CATEGORY
const createCategory = createAsyncThunk("category/create-category", async (data) => {
  const response = await axios.post("http://localhost:9006/api/v1/category/create-category", data);
  return response.data;
});

// 👉 UPDATE CATEGORY
// const updateCategory = createAsyncThunk(
//   "category/update-category",
//   async ({ id, updatedData }, ll) => {
//     try {
//       const response = await axios.patch(
//         `http://localhost:9006/api/v1/category/update-category/${id}`,
//         updatedData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data; // should include `data` field
//     } catch (error) {
//       return ll.rejectWithValue(error.response?.data || "Update failed");
//     }
//   }
// );

const updateCategory = createAsyncThunk("category/update-category", async (values, thunkAPI) => {
    try {
      const response = await axios.patch(`http://localhost:9006/api/v1/category/update-category`,values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Update failed");
    }
  }
);


const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:9006/api/v1/category/delete-category/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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

    // Create
    builder.addCase(createCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message;
    });
    builder.addCase(createCategory.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    // Update
    builder.addCase(updateCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message;

      const updatedItem = action.payload?.data;
      if (updatedItem && state.data?.data) {
        state.data.data = state.data.data.map((item) =>
          item._id === updatedItem._id ? updatedItem : item
        );
      }
    });
    builder.addCase(updateCategory.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

     builder.addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      builder.addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.data = state.data.data.filter(
          (item) => item._id !== action.meta.arg
        );
      })
     builder.addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload || 'Something went wrong';
      });
  },
});

export { getCategory, createCategory, updateCategory,deleteCategory };
export default categorySlice.reducer;
