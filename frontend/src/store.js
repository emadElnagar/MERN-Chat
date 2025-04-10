import { configureStore } from "@reduxjs/toolkit";
import usereducer from "./features/UserFeatures";
import themereducer from "./features/ThemeFeatures";
import chatReducer from "./features/ChatFeatures";
import messageReducer from "./features/MessageFeatures";

const store = configureStore({
  reducer: {
    user: usereducer,
    theme: themereducer,
    chat: chatReducer,
    message: messageReducer,
  },
});

export default store;
