import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        if (typeof action.payload.quantity === 'number') {
          existing.quantity = action.payload.quantity;
        } else {
          existing.quantity = (existing.quantity || 1) + 1;
        }
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    clearWishlist: (state) => {
      state.items = [];
    },

    setWishlist: (state, action) => {
      const incoming = action.payload;
      if (Array.isArray(incoming)) {
        state.items = incoming;
      }
    },
  },
});

// Export actions and selector
export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlist
} = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;

export default wishlistSlice.reducer;
