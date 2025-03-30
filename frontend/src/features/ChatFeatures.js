import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:5000/api/chats";

const initialState = {
  chats: [],
  chat: null,
  isLoading: false,
  error: null,
};

export const FetchChats = createAsyncThunk(
  "chat/FetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${url}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(FetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload;
      })
      .addCase(FetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export default chatSlice.reducer;
