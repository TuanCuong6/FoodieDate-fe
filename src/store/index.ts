import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import areasReducer from './slices/areasSlice';
import restaurantsReducer from './slices/restaurantsSlice';
import plansReducer from './slices/plansSlice';
import visitHistoriesReducer from './slices/visitHistoriesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    areas: areasReducer,
    restaurants: restaurantsReducer,
    plans: plansReducer,
    visitHistories: visitHistoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
