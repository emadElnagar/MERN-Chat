import { configureStore } from "@reduxjs/toolkit";
import usereducer from "./features/UserFeatures";
import themereducer from "./features/ThemeFeatures";
import chatReducer from "./features/ChatFeatures";

const store = configureStore({
  reducer: {
    user: usereducer,
    theme: themereducer,
    chat: chatReducer,
  },
});

export default store;
