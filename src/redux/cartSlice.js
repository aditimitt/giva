// cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const item = state.cartItems.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(item => item.id === id);
      if (item) {
        item.quantity += quantity;
        if (item.quantity <= 0) {
          state.cartItems = state.cartItems.filter(item => item.id !== id);
        }
      }
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;
