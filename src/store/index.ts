import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import areasReducer from './slices/areasSlice';
import restaurantsReducer from './slices/restaurantsSlice';
import plansReducer from './slices/plansSlice';
import visitHistoriesReducer from './slices/visitHistoriesSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  areas: areasReducer,
  restaurants: restaurantsReducer,
  plans: plansReducer,
  visitHistories: visitHistoriesReducer,
});

// Reset store action
const RESET_STORE = 'RESET_STORE';

export const resetStore = () => ({ type: RESET_STORE });

const resettableRootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    // Reset tất cả state về undefined, Redux sẽ tự động khởi tạo lại với initialState
    state = undefined;
  }
  return rootReducer(state, action);
};

export const store = configureStore({
  reducer: resettableRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
