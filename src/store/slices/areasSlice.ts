import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { areaService, AreaDto, CreateAreaDto, UpdateAreaDto } from '../../services';

interface AreasState {
  areas: AreaDto[];
  loading: boolean;
  error: string | null;
}

const initialState: AreasState = {
  areas: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchAreas = createAsyncThunk(
  'areas/fetchAreas',
  async (coupleId: number, { rejectWithValue }) => {
    try {
      const response = await areaService.getAreas(coupleId);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Không thể tải danh sách khu vực');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createArea = createAsyncThunk(
  'areas/createArea',
  async (dto: CreateAreaDto, { rejectWithValue }) => {
    try {
      const response = await areaService.createArea(dto);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Không thể thêm khu vực');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateArea = createAsyncThunk(
  'areas/updateArea',
  async ({ id, dto }: { id: number; dto: UpdateAreaDto }, { rejectWithValue }) => {
    try {
      const response = await areaService.updateArea(id, dto);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Không thể cập nhật khu vực');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteArea = createAsyncThunk(
  'areas/deleteArea',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await areaService.deleteArea(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || 'Không thể xóa khu vực');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const areasSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {
    clearAreasError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Areas
    builder
      .addCase(fetchAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.loading = false;
        state.areas = action.payload;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Area
    builder
      .addCase(createArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArea.fulfilled, (state, action) => {
        state.loading = false;
        state.areas.push(action.payload);
      })
      .addCase(createArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Area
    builder
      .addCase(updateArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArea.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.areas.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.areas[index] = action.payload;
        }
      })
      .addCase(updateArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Area
    builder
      .addCase(deleteArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArea.fulfilled, (state, action) => {
        state.loading = false;
        state.areas = state.areas.filter(a => a.id !== action.payload);
      })
      .addCase(deleteArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAreasError } = areasSlice.actions;
export default areasSlice.reducer;
