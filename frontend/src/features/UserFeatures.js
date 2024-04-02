import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const url = 'http://localhost:5000/api/users';


const initialState = {
  users: [],
  user: null,
  profile: null,
  isLoading: false,
  error: null
}

// User sign up
export const SignUp = createAsyncThunk("users/register", async (user, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${url}/register`, user);
    const data = jwtDecode(response.data.token);
    sessionStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {    
    return rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'user',
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
        state.users.push(action.payload);
        state.user = action.payload;
      })
      .addCase(SignUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
  }
});

export default userSlice.reducer;
