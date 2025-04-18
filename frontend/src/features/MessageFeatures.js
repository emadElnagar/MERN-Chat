import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:5000/api/messages";

const initialState = {
  messages: [],
  message: null,
  isLoading: false,
  error: null,
};

// Create message
export const newMessage = createAsyncThunk(
  "message/newMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${url}`, messageData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(newMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(newMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);
        state.message = action.payload;
      })
      .addCase(newMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default messageSlice.reducer;
