import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/users/wishlist");
    return data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggle",
  async ({ productId, isInWishlist }, { rejectWithValue }) => {
    try {
      if (isInWishlist) {
        await api.delete(`/users/wishlist/${productId}`);
      } else {
        await api.post(`/users/wishlist/${productId}`);
      }
      const { data } = await api.get("/users/wishlist");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearWishlistState: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
