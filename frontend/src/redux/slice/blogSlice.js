import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


 const getBlog = createAsyncThunk(
  'blog/get-all-blog',
  async () => {
    const response = await axios.get(`http://localhost:9006/api/v1/blog/user-get-blog`);
    return response.data;
  }
);

 const getBlogByCategory = createAsyncThunk(
  "blog/getBlogByCategory",
  async (categoryId) => {
    const res = await axios.get(
      `http://localhost:9006/api/v1/blog/user-get-blog-by-category/${categoryId}`
    );
    return res.data; 
  }
);

 const likeBlog = createAsyncThunk(
  "blog/likeBlog",
  async (blogId) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:9006/api/v1/blog/like/${blogId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { blogId, likes: res.data.likes };
  }
);

const addComment = createAsyncThunk(
  "blog/addComment",
  async ({ blogId, text }) => {   // yahan text hona chahiye, commentText nahi
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:9006/api/v1/blog/comment/${blogId}`,
      { text },                     // match frontend
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { blogId, comment: res.data.comment }; // sirf naya comment
  }
);

 const updateComment = createAsyncThunk(
  "blog/updateComment",
  async ({ blogId, commentId, text }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:9006/api/v1/blog/comment/update/${blogId}/${commentId}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return {
        blogId,
        updatedComment: res.data.comment,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating comment");
    }
  }
);

const deleteComment = createAsyncThunk(
  "blog/deleteComment",
  async ({ blogId, commentId }, { rejectWithValue }) => {
    try {
      await axios.delete(
        `http://localhost:9006/api/v1/blog/comment/delete/${blogId}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return { blogId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting comment");
    }
  }
);


const blogSlice = createSlice({
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


   builder
      .addCase(getBlogByCategory.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(getBlogByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.data;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getBlogByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload || 'Failed to fetch blogs';
      });



  builder.addCase(likeBlog.fulfilled, (state, action) => {
  const { blogId, likes } = action.payload;
  
  state.blogs = state.blogs.map(blog => 
    blog._id === blogId ? {...blog, likes: likes} : blog
  );
});
      builder.addCase(addComment.fulfilled, (state, action) => {
  const { blogId, comment } = action.payload; // single new comment
  const blog = state.blogs.find(b => b._id === blogId);
  if (blog) {
    if (!Array.isArray(blog.comments)) blog.comments = []; // ensure array
    blog.comments.push(comment); // add new comment
  }
});




    builder.addCase(updateComment.fulfilled, (state, action) => {
  console.log("🔥 updateComment.fulfilled payload:", action.payload);

  const { blogId, updatedComment } = action.payload;

  console.log("👉 blogId:", blogId);
  console.log("👉 updatedComment:", updatedComment);

  const blog = state.blogs?.find((b) => b._id === blogId);
  console.log("👉 Found Blog:", blog);

  if (blog) {
    const index = blog.comments?.findIndex(
      (c) => c._id === updatedComment?._id
    );

    console.log("👉 Comment index:", index);

    if (index !== -1) {
      blog.comments[index] = updatedComment;
      console.log("✅ Comment updated successfully");
    } else {
      console.warn("⚠ Comment not found to update!");
    }
  } else {
    console.warn("⚠ Blog not found!");
  }
});



      builder.addCase(deleteComment.fulfilled, (state, action) => {
        const { blogId, commentId } = action.payload;

        const blog = state.blogs.find(b => b._id === blogId);
        if (blog) {
          blog.comments = blog.comments.filter(c => c._id !== commentId);
        }
      });
  
  

  },
});
export {getBlog,getBlogByCategory,likeBlog, addComment,updateComment,deleteComment}
export default blogSlice.reducer;
