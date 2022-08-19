import { createSlice } from '@reduxjs/toolkit';
import { DynamoConnector } from '../../DynamoConnector';
import { fetchCommanderLeaderboardItems } from './commandersLeaderboardSlice';
import { fetchAll, setSearchFilters } from './leaderboardSlice';
import { useDispatch, useSelector } from 'react-redux';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    windowWidth: 0,
    isMobile: false,
    isHydrated: false,
    stats: {
      total: 0,
    },
    route: {
      uri: '/',
      title: 'Leaderboard',
    }
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
    },
    updateRoute: (state, action) => {
      state.route.uri = action.payload.uri;
      state.route.title = action.payload.title;
    },
    setIsHydrated: (state, action) => {
      state.isHydrated = true;
    },
  },
});

// Actions
export const { setWindowWidth, setIsMobile, setStats, updateRoute, setIsHydrated } = appSlice.actions;

// Selectors
export const hydrate = () => (dispatch) => {
  dispatch(setIsHydrated(true));

  dispatch(fetchCommanderLeaderboardItems(null, true));
  dispatch(fetchAll(null, {}, true));
  dispatch(getAppStats());
}

export const getAppStats = () => (dispatch) => {
  DynamoConnector.getStats(
    (results) => {
      dispatch(setStats(results));
  });
};

export const setAppRoute = (route) => (dispatch) => {
  if (route) {
    let newRoute = '';
    let newTitle = '';

    console.log(`ROUTE :: ${route}`);

    switch (route) {
      case '/why':
        newRoute = `/why`;
        newTitle = `Why?!`;
        break;
      case '/commanders':
        dispatch(fetchCommanderLeaderboardItems(null, true));
        newRoute = `/commanders`;
        newTitle = `Commanders`;
        break;
      default: 
        newRoute = `/`;
        newTitle = `Leaderboard`;
    }

    dispatch(updateRoute({
      uri: newRoute,
      title: newTitle,
    }))
  }
}


export default appSlice.reducer;
