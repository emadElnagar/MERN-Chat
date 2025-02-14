import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  error: null,
  theme: localStorage.getItem("theme") || "light",
};

// Change theme action
export const changeTheme = createAsyncThunk(
  "theme/change",
  async (theme, { rejectWithValue }) => {
    try {
      localStorage.setItem("theme", theme);
      return theme;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const themeSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changeTheme.pending, (state) => {
        state.error = null;
      })
      .addCase(changeTheme.fulfilled, (state, action) => {
        state.error = null;
        state.theme = action.payload;
      })
      .addCase(changeTheme.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

export default themeSlice.reducer;
