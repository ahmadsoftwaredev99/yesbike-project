import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const placeOrder = createAsyncThunk("orders/place", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/orders", payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMyOrders = createAsyncThunk("orders/fetchMine", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/orders/myorders");
    return data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchOrderById = createAsyncThunk("orders/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    myOrders: [],
    loading: false,
    error: null,
    lastOrder: null,
    current: null,
  },
  reducers: {
    clearLastOrder: (state) => {
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

export const { clearLastOrder } = orderSlice.actions;
export default orderSlice.reducer;
