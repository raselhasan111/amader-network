import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: number;
  exp: number;
  email: string;
  name?: string;
  picture?: string;
}

interface UserState {
  profile: UserProfile | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  profile: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

