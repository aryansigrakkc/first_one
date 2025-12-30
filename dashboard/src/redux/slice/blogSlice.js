import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const token = window.localStorage.getItem("token");




 const getBlog = createAsyncThunk(
  'blog/get-all-blog',
  async ({ page = 1, limit = 10 }) => {
    const response = await axios.get(`http://localhost:9006/api/v1/blog/get-blog?page=${page}&limit=${limit}`);
    return response.data;
  }
);

const createBlog=createAsyncThunk('blog/create-blog',async(e)=>{
 const createBlog= await axios.post('http://localhost:9006/api/v1/blog/create-blog',e)
 return createBlog.data
})
const deleteBlog = createAsyncThunk(
   'blog/delete-blog',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:9006/api/v1/blog/delete-blog/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

 const updateBlog = createAsyncThunk('blog/updateBlog', async (data, thunkAPI) => {
  try {
    const res = await axios.patch(
      `http://localhost:9006/api/v1/blog/update-blog`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Update failed');
  }
});

// export const fetchHomeBlogs = createAsyncThunk('blogs/fetchHomeBlogs', async () => {
//   const response = await axios.get('http://localhost:9006/api/v1/blog/update-blog?limit=6');
//   return response.data.data;  // array: [{ categoryId, categoryName, blogs: [...] }, ...]
// });


const blogSLice = createSlice({
  name: "blog",
  initialState: {
    isLoading: false,
    isError: false,
    data: null,
    message: "",
  },
  extraReducers: (builder) => {
    // Get
   builder
      .addCase(getBlog.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.data;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload || 'Failed to fetch blogs';
      });

     builder.addCase(deleteBlog.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
          })
          builder.addCase(deleteBlog.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data.data = state.data.data.filter(
              (item) => item._id !== action.meta.arg
            );
          })
         builder.addCase(deleteBlog.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = action.payload || 'Something went wrong';
          });

    //        builder
    //     .addCase(updateBlog.pending, (state) => {
    //     state.isLoading = true;
    //     state.isError = null;
    //   })
    //   .addCase(updateBlog.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     const updatedBlog = action.payload;
      
    //     if (updatedBlog && updatedBlog._id) {
    //       const index = state.data.data.findIndex((b) => b._id === updatedBlog._id);
    //       if (index !== -1) {
    //         state.data.data[index] = updatedBlog;
    //       }
    //     }
    //   })
    //   .addCase(updateBlog.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.isError = action.payload;
    //   });

      builder.addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
        state.updateResponse = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateResponse = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload || "Update failed";
      });
        builder.addCase(createBlog.pending, (state) => {
            state.isLoading = true;
          });
          builder.addCase(createBlog.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = action.payload.message;
          });
          builder.addCase(createBlog.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
          });
}
})

export {getBlog,deleteBlog,updateBlog,createBlog}
export default blogSLice.reducer