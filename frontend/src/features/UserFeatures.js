import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const url = "http://localhost:5000/api/users";

const initialState = {
  users: [],
  searchedUsers: [],
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
      const data = jwtDecode(response.data.token);
      sessionStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// User login
export const Login = createAsyncThunk(
  "users/login",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login`, user);
      const data = jwtDecode(response.data.token);
      sessionStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// User logout
export const Logout = createAsyncThunk("users/logout", async () => {
  sessionStorage.removeItem("userInfo");
});

// Get single user
export const GetSingleUser = createAsyncThunk(
  "users/profile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/profile/${id}`);
      return response.data;
    } catch (error) {
      rejectWithValue(error.message);
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
      rejectWithValue(error.message);
    }
  }
);

// Search user
export const SearchUsers = createAsyncThunk(
  "users/search",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/search?search=${keyword}`);
      return response.data;
    } catch (error) {
      rejectWithValue(error.message);
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
      })
      .addCase(SignUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.users.push(action.payload);
        state.user = action.payload;
      })
      .addCase(SignUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // User login
      .addCase(Login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(Login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // User logout
      .addCase(Logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Logout.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
      })
      // Get single user
      .addCase(GetSingleUser.pending, (state) => {
        state.isLoading = true;
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
      })
      .addCase(SearchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.searchedUsers = action.payload;
      })
      .addCase(SearchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export default userSlice.reducer;
