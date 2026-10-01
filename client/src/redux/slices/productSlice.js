import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products", { params: { featured: true, limit: 8 } });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNew",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products", { params: { isNew: true, limit: 8 } });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products", { params: { isBestSeller: true, limit: 8 } });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    page: 1,
    pages: 1,
    total: 0,
    loading: false,
    error: null,
    current: null,
    currentLoading: false,
    related: [],
    featured: [],
    newArrivals: [],
    bestSellers: [],
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.currentLoading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellers = action.payload;
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
