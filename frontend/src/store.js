import { configureStore } from '@reduxjs/toolkit';
import usereducer from './features/UserFeatures';

const store = configureStore({
  reducer: {
    user: usereducer
  }
});

export default store;
