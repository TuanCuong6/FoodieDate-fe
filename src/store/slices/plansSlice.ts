import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { planService, PlanDto, CreatePlanDto, UpdatePlanDto } from '../../services';

interface PlansState {
  plans: PlanDto[];
  selectedPlan: PlanDto | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
  };
}

const initialState: PlansState = {
  plans: [],
  selectedPlan: null,
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans',
  async ({ coupleId, status }: { coupleId: number; status?: string }) => {
    const response = await planService.getPlansByCoupleId(coupleId, status);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch plans');
    }
    return response.data;
  }
);

export const fetchUpcomingPlans = createAsyncThunk(
  'plans/fetchUpcomingPlans',
  async (coupleId: number) => {
    const response = await planService.getUpcomingPlans(coupleId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch upcoming plans');
    }
    return response.data;
  }
);

export const fetchPlansByDateRange = createAsyncThunk(
  'plans/fetchPlansByDateRange',
  async ({ coupleId, startDate, endDate }: { coupleId: number; startDate: string; endDate: string }) => {
    const response = await planService.getPlansByDateRange(coupleId, startDate, endDate);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch plans');
    }
    return response.data;
  }
);

export const fetchPlanById = createAsyncThunk(
  'plans/fetchPlanById',
  async (id: number) => {
    const response = await planService.getPlanById(id);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch plan');
    }
    return response.data;
  }
);

export const createPlan = createAsyncThunk(
  'plans/createPlan',
  async (dto: CreatePlanDto) => {
    const response = await planService.createPlan(dto);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create plan');
    }
    return response.data;
  }
);

export const updatePlan = createAsyncThunk(
  'plans/updatePlan',
  async ({ id, dto }: { id: number; dto: UpdatePlanDto }) => {
    const response = await planService.updatePlan(id, dto);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update plan');
    }
    return response.data;
  }
);

export const deletePlan = createAsyncThunk(
  'plans/deletePlan',
  async (id: number) => {
    const response = await planService.deletePlan(id);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete plan');
    }
    return id;
  }
);

export const markPlanAsCompleted = createAsyncThunk(
  'plans/markAsCompleted',
  async (id: number) => {
    const response = await planService.markAsCompleted(id);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to mark plan as completed');
    }
    return response.data;
  }
);

export const markPlanAsCancelled = createAsyncThunk(
  'plans/markAsCancelled',
  async (id: number) => {
    const response = await planService.markAsCancelled(id);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to cancel plan');
    }
    return response.data;
  }
);

export const randomRestaurant = createAsyncThunk(
  'plans/randomRestaurant',
  async (coupleId: number) => {
    const response = await planService.randomRestaurant(coupleId);
    if (!response.success || response.data === undefined) {
      throw new Error(response.message || 'No restaurants available');
    }
    return response.data;
  }
);

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PlansState['filters']>) => {
      state.filters = action.payload;
    },
    clearSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch plans
    builder.addCase(fetchPlans.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPlans.fulfilled, (state, action) => {
      state.loading = false;
      state.plans = action.payload;
    });
    builder.addCase(fetchPlans.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch plans';
    });

    // Fetch upcoming plans
    builder.addCase(fetchUpcomingPlans.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUpcomingPlans.fulfilled, (state, action) => {
      state.loading = false;
      state.plans = action.payload;
    });
    builder.addCase(fetchUpcomingPlans.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch upcoming plans';
    });

    // Fetch plans by date range
    builder.addCase(fetchPlansByDateRange.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPlansByDateRange.fulfilled, (state, action) => {
      state.loading = false;
      state.plans = action.payload;
    });
    builder.addCase(fetchPlansByDateRange.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch plans';
    });

    // Fetch plan by ID
    builder.addCase(fetchPlanById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPlanById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedPlan = action.payload;
    });
    builder.addCase(fetchPlanById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch plan';
    });

    // Create plan
    builder.addCase(createPlan.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPlan.fulfilled, (state, action) => {
      state.loading = false;
      state.plans.push(action.payload);
    });
    builder.addCase(createPlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create plan';
    });

    // Update plan
    builder.addCase(updatePlan.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePlan.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.plans.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
      if (state.selectedPlan?.id === action.payload.id) {
        state.selectedPlan = action.payload;
      }
    });
    builder.addCase(updatePlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to update plan';
    });

    // Delete plan
    builder.addCase(deletePlan.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePlan.fulfilled, (state, action) => {
      state.loading = false;
      state.plans = state.plans.filter((p) => p.id !== action.payload);
      if (state.selectedPlan?.id === action.payload) {
        state.selectedPlan = null;
      }
    });
    builder.addCase(deletePlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete plan';
    });

    // Mark as completed
    builder.addCase(markPlanAsCompleted.fulfilled, (state, action) => {
      const index = state.plans.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
      if (state.selectedPlan?.id === action.payload.id) {
        state.selectedPlan = action.payload;
      }
    });

    // Mark as cancelled
    builder.addCase(markPlanAsCancelled.fulfilled, (state, action) => {
      const index = state.plans.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
      if (state.selectedPlan?.id === action.payload.id) {
        state.selectedPlan = action.payload;
      }
    });
  },
});

export const { setFilters, clearSelectedPlan, clearError } = plansSlice.actions;
export default plansSlice.reducer;
