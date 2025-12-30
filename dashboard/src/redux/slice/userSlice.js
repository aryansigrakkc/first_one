

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


 const loginUser = createAsyncThunk(
  'user/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:9006/api/v1/register/login-user', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


 const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:9006/api/v1/register/get-user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const initialState = {
  data: null,
  userInfo: null,
  isLoading: false,
  isError: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      state.data = null;
      state.userInfo = null;
      state.isLoading = false;
      state.isError = null;
    },
  },
  extraReducers: (builder) => {
    // 🔹 Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload || 'Login failed';
      });

    // 🔸 Get user by token
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload || 'Failed to fetch user';
      });
  },
});

export const { logoutUser } = userSlice.actions;
export {loginUser,getUser}

export default userSlice.reducer;
