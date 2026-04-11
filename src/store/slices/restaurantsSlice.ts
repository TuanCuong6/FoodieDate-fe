import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  restaurantService,
  RestaurantDto,
  CreateRestaurantDto,
  UpdateRestaurantDto,
  RestaurantStatus,
} from "../../services";
import { getSeedRestaurants } from "../../data/seedRestaurants";

interface RestaurantsState {
  restaurants: RestaurantDto[];
  loading: boolean;
  error: string | null;
  filters: {
    areaId?: number;
    status?: RestaurantStatus;
    searchQuery: string;
  };
}

const initialState: RestaurantsState = {
  restaurants: [],
  loading: false,
  error: null,
  filters: {
    searchQuery: "",
  },
};

// Async Thunks
export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchRestaurants",
  async (
    {
      coupleId,
      areaId,
      status,
    }: { coupleId: number; areaId?: number; status?: RestaurantStatus },
    { rejectWithValue },
  ) => {
    try {
      const response = await restaurantService.getRestaurants(
        coupleId,
        areaId,
        status,
      );
      if (response.success && response.data) {
        return response.data;
      }
      const seed = getSeedRestaurants(coupleId);
      return seed
        .filter((r) => (areaId ? r.areaId === areaId : true))
        .filter((r) => (status !== undefined ? r.status === status : true));
    } catch (error: any) {
      const seed = getSeedRestaurants(coupleId);
      return seed
        .filter((r) => (areaId ? r.areaId === areaId : true))
        .filter((r) => (status !== undefined ? r.status === status : true));
    }
  },
);

export const createRestaurant = createAsyncThunk(
  "restaurants/createRestaurant",
  async (dto: CreateRestaurantDto, { rejectWithValue }) => {
    try {
      const response = await restaurantService.createRestaurant(dto);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || "Không thể thêm quán ăn");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateRestaurant = createAsyncThunk(
  "restaurants/updateRestaurant",
  async (
    { id, dto }: { id: number; dto: UpdateRestaurantDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await restaurantService.updateRestaurant(id, dto);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || "Không thể cập nhật quán ăn");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteRestaurant = createAsyncThunk(
  "restaurants/deleteRestaurant",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await restaurantService.deleteRestaurant(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || "Không thể xóa quán ăn");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearRestaurantsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Restaurants
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Restaurant
    builder
      .addCase(createRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants.push(action.payload);
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Restaurant
    builder
      .addCase(updateRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.restaurants.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (index !== -1) {
          state.restaurants[index] = action.payload;
        }
      })
      .addCase(updateRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Restaurant
    builder
      .addCase(deleteRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = state.restaurants.filter(
          (r) => r.id !== action.payload,
        );
      })
      .addCase(deleteRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearRestaurantsError } = restaurantsSlice.actions;
export default restaurantsSlice.reducer;
