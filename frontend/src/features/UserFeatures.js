import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_AUTH_URL;

const initialState = {
  users: [],
  searchedUsers: [],
  friendsList: [],
  token: null,
  user: null,
  profile: null,
  isLoading: false,
  error: null,
};

// User sign up
export const SignUp = createAsyncThunk(
  "users/register",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/register`, user);
      const data = response.data;
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// User login
export const Login = createAsyncThunk(
  "users/login",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login`, user);
      const data = response.data;
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// User logout
export const Logout = createAsyncThunk("users/logout", async () => {
  sessionStorage.removeItem("userInfo");
  sessionStorage.removeItem("token");
});

// Get me
export const GetMe = createAsyncThunk(
  "users/me",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${url}/me`, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// Get single user
export const GetSingleUser = createAsyncThunk(
  "users/profile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/profile/${id}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// Change user image
export const ChagneUserImage = createAsyncThunk(
  "users/image",
  async (data, { rejectWithValue }) => {
    try {
      axios.post(
        `http://localhost:5000/api/users/${data.id}/image/change`,
        data.formdata
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// Search user
export const SearchUsers = createAsyncThunk(
  "users/search",
  async (keyword, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${url}?search=${keyword}`, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// Get friends
export const GetFriends = createAsyncThunk(
  "users/friends",
  async (_, rejectWithValue) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${url}/friends`, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// Add new friend
export const AddFriend = createAsyncThunk(
  "users/addFriend",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${url}/sendrequest`,
        { receiver: id },
        config
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// Cancel friend request
export const CancelRequest = createAsyncThunk(
  "users/cancelRequest",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${url}/cancelrequest`,
        { receiver: id },
        config
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// Accept friend request
export const AcceptRequest = createAsyncThunk(
  "users/acceptRequest",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${url}/acceptrequest`,
        { sender: id },
        config
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// Reject friend request
export const RejectRequest = createAsyncThunk(
  "users/rejectRequest",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${url}/rejectrequest`,
        { sender: id },
        config
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// Unfriend (Remove friend)
export const Unfriend = createAsyncThunk(
  "users/remove",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${url}/removefriend`,
        { friendId: id },
        config
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // User register
      .addCase(SignUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(SignUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.token = action.payload;
      })
      .addCase(SignUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // User login
      .addCase(Login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.token = action.payload;
      })
      .addCase(Login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // User logout
      .addCase(Logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(Logout.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
      })
      // Get me
      .addCase(GetMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(GetMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Get single user
      .addCase(GetSingleUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetSingleUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.profile = action.payload;
      })
      .addCase(GetSingleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Change user image
      .addCase(ChagneUserImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(ChagneUserImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const {
          arg: { _id },
        } = action.meta;
        if (_id) {
          state.users = state.users.map((user) =>
            user._id === _id ? action.payload : user
          );
        }
      })
      .addCase(ChagneUserImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Search user
      .addCase(SearchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(SearchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.searchedUsers = action.payload;
      })
      .addCase(SearchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Get friends
      .addCase(GetFriends.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.friendsList = action.payload;
      })
      .addCase(GetFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Add new friend
      .addCase(AddFriend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(AddFriend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.friendsList.sentRequests.push(action.payload);
      })
      .addCase(AddFriend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Cancel friend request
      .addCase(CancelRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(CancelRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.friendsList.sentRequests.pull(action.payload);
      })
      .addCase(CancelRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Accept friend request
      .addCase(AcceptRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(AcceptRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.friendsList.sentRequests.pull(action.payload);
        state.friendsList.friends.push(action.payload);
      })
      .addCase(AcceptRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Reject friend request
      .addCase(RejectRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(RejectRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friendsList.friendRequests.pull(action.payload);
      })
      .addCase(RejectRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Unfriend
      .addCase(Unfriend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(Unfriend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friendsList.friends.pull(action.payload);
      })
      .addCase(Unfriend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export default userSlice.reducer;
