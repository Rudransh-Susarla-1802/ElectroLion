import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  password: '',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      const {
        name,
        email,
        password,
      } = action.payload;
      state.name = name
      state.email = email;
      state.password = password;
      
    },
    clearProfile: (state) => {
      state.name = ''
      state.email = '';
      state.password = '';
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
