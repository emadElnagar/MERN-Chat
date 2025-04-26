import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:5000/api/chats";

const initialState = {
  chats: [],
  chat: null,
  isLoading: false,
  error: null,
};

// Get user chats
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

// Get single chat
export const FetchSingleChat = createAsyncThunk(
  "chat/FetchSingleChat",
  async (chatId, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${url}/${chatId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create chat
export const CreateChat = createAsyncThunk(
  "chat/CreateChat",
  async (chatData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${url}`, chatData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Rename chat
export const RenameChat = createAsyncThunk(
  "chat/RenameChat",
  async (chat, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${url}/${chat._id}`,
        { chatName: chat.chatName },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add user to chat
export const AddUser = createAsyncThunk(
  "chat/AddUser",
  async (data, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${url}/${data.chatId}/addUser`,
        { userId: data.userId },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove user from chat
export const RemoveUser = createAsyncThunk(
  "chat/RemoveUser",
  async (data, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${url}/${data.chatId}/removeUser`,
        { userId: data.userId },
        config
      );
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
      // Fetch chats
      .addCase(FetchChats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(FetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.chats = action.payload;
      })
      .addCase(FetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Fetch single chat
      .addCase(FetchSingleChat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(FetchSingleChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.chat = action.payload;
      })
      .addCase(FetchSingleChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Create chat
      .addCase(CreateChat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CreateChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.chats.push(action.payload);
      })
      .addCase(CreateChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Rename chat
      .addCase(RenameChat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(RenameChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.chat = action.payload;
      })
      .addCase(RenameChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Add user to caht
      .addCase(AddUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
        state.chat = action.payload;
      })
      .addCase(AddUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // remove user from caht
      .addCase(RemoveUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(RemoveUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
        state.chat = action.payload;
      })
      .addCase(RemoveUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export default chatSlice.reducer;
