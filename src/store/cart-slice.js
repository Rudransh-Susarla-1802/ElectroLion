import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
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
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCart: (state, action) => {
      const incoming = action.payload;
      if (Array.isArray(incoming) && incoming.length > 0) {
        state.items = incoming;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export default cartSlice.reducer;
