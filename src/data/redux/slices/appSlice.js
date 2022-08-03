import { createSlice } from '@reduxjs/toolkit';
import { DynamoConnector } from '../../DynamoConnector';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    windowWidth: 0,
    isMobile: false,
    stats: {
      total: 0,
    },
  },
  reducers: {
    setWindowWidth: (state, action) => {
      state.windowWidth = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setStats: (state, action) => {
      state.stats.total = action.payload?.Items?.[0]?.totalCount;
    }
  },
});

// Actions
export const { setWindowWidth, setIsMobile, setStats } = appSlice.actions;

// Selectors
export const getAppStats = () => (dispatch) => {
  DynamoConnector.getStats(
    (results) => {
      dispatch(setStats(results));
  });
};


export default appSlice.reducer;
