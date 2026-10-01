import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "yesbike_cart";
const storedCart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const persist = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

const lineKey = (item) => `${item.product}_${item.size || ""}_${item.color || ""}`;

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: storedCart, // { product, name, image, price, stock, size, color, quantity }
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existing = state.items.find((i) => lineKey(i) === lineKey(newItem));
      if (existing) {
        existing.quantity = Math.min(existing.quantity + newItem.quantity, existing.stock);
      } else {
        state.items.push(newItem);
      }
      persist(state.items);
    },
    increaseQty: (state, action) => {
      const item = state.items.find((i) => lineKey(i) === action.payload);
      if (item && item.quantity < item.stock) item.quantity += 1;
      persist(state.items);
    },
    decreaseQty: (state, action) => {
      const item = state.items.find((i) => lineKey(i) === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      persist(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => lineKey(i) !== action.payload);
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addToCart, increaseQty, decreaseQty, removeFromCart, clearCart } = cartSlice.actions;
export const cartLineKey = lineKey;
export default cartSlice.reducer;
