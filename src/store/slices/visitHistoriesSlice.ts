import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import visitHistoryService, {
  VisitHistoryDto,
  CreateVisitHistoryDto,
  UpdateVisitHistoryDto,
} from '../../services/visitHistoryService';

interface VisitHistoriesState {
  visitHistories: VisitHistoryDto[];
  loading: boolean;
  error: string | null;
}

const initialState: VisitHistoriesState = {
  visitHistories: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchVisitHistories = createAsyncThunk(
  'visitHistories/fetchAll',
  async () => {
    return await visitHistoryService.getAll();
  }
);

export const fetchVisitHistoryById = createAsyncThunk(
  'visitHistories/fetchById',
  async (id: number) => {
    return await visitHistoryService.getById(id);
  }
);

export const fetchVisitHistoriesByCoupleId = createAsyncThunk(
  'visitHistories/fetchByCoupleId',
  async (coupleId: number) => {
    return await visitHistoryService.getByCoupleId(coupleId);
  }
);

export const fetchVisitHistoriesByRestaurantId = createAsyncThunk(
  'visitHistories/fetchByRestaurantId',
  async (restaurantId: number) => {
    return await visitHistoryService.getByRestaurantId(restaurantId);
  }
);

export const fetchRecentVisits = createAsyncThunk(
  'visitHistories/fetchRecent',
  async ({ coupleId, count = 10 }: { coupleId: number; count?: number }) => {
    return await visitHistoryService.getRecentVisits(coupleId, count);
  }
);

export const createVisitHistory = createAsyncThunk(
  'visitHistories/create',
  async (dto: CreateVisitHistoryDto) => {
    return await visitHistoryService.create(dto);
  }
);

export const updateVisitHistory = createAsyncThunk(
  'visitHistories/update',
  async ({ id, dto }: { id: number; dto: UpdateVisitHistoryDto }) => {
    return await visitHistoryService.update(id, dto);
  }
);

export const deleteVisitHistory = createAsyncThunk(
  'visitHistories/delete',
  async (id: number) => {
    await visitHistoryService.delete(id);
    return id;
  }
);

const visitHistoriesSlice = createSlice({
  name: 'visitHistories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchVisitHistories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitHistories.fulfilled, (state, action: PayloadAction<VisitHistoryDto[]>) => {
        state.loading = false;
        state.visitHistories = action.payload;
      })
      .addCase(fetchVisitHistories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch visit histories';
      })

      // Fetch by couple ID
      .addCase(fetchVisitHistoriesByCoupleId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitHistoriesByCoupleId.fulfilled, (state, action: PayloadAction<VisitHistoryDto[]>) => {
        state.loading = false;
        state.visitHistories = action.payload;
      })
      .addCase(fetchVisitHistoriesByCoupleId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch visit histories';
      })

      // Fetch by restaurant ID
      .addCase(fetchVisitHistoriesByRestaurantId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitHistoriesByRestaurantId.fulfilled, (state, action: PayloadAction<VisitHistoryDto[]>) => {
        state.loading = false;
        state.visitHistories = action.payload;
      })
      .addCase(fetchVisitHistoriesByRestaurantId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch visit histories';
      })

      // Fetch recent
      .addCase(fetchRecentVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentVisits.fulfilled, (state, action: PayloadAction<VisitHistoryDto[]>) => {
        state.loading = false;
        state.visitHistories = action.payload;
      })
      .addCase(fetchRecentVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recent visits';
      })

      // Create
      .addCase(createVisitHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVisitHistory.fulfilled, (state, action: PayloadAction<VisitHistoryDto>) => {
        state.loading = false;
        state.visitHistories.unshift(action.payload);
      })
      .addCase(createVisitHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create visit history';
      })

      // Update
      .addCase(updateVisitHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVisitHistory.fulfilled, (state, action: PayloadAction<VisitHistoryDto>) => {
        state.loading = false;
        const index = state.visitHistories.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.visitHistories[index] = action.payload;
        }
      })
      .addCase(updateVisitHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update visit history';
      })

      // Delete
      .addCase(deleteVisitHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVisitHistory.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.visitHistories = state.visitHistories.filter((v) => v.id !== action.payload);
      })
      .addCase(deleteVisitHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete visit history';
      });
  },
});

export const { clearError } = visitHistoriesSlice.actions;
export default visitHistoriesSlice.reducer;
