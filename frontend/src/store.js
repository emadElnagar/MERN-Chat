import { configureStore } from "@reduxjs/toolkit";
import usereducer from "./features/UserFeatures";
import themereducer from "./features/ThemeFeatures";

const store = configureStore({
  reducer: {
    user: usereducer,
    theme: themereducer,
  },
});

export default store;
