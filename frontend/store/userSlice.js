// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
  role: null,
  authLoading: true
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthenticatedUser: (state, action) => {
      state.user = action.payload || null;
      state.role = action.payload?.role || null;
      state.isLoggedIn = Boolean(action.payload);
      state.authLoading = false;
    },
    clearAuthentication: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.role = null;
      state.authLoading = false;
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    }
  }
});

export const { setAuthenticatedUser, clearAuthentication, setAuthLoading } = userSlice.actions;

// Selectors
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;

export default userSlice.reducer;