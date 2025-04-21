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

// Get all messages
export const getMessages = createAsyncThunk(
  "message/getMessages",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/${id}`);
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
      // new message
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
        state.error = action.error;
      })
      // get messages
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export default messageSlice.reducer;
