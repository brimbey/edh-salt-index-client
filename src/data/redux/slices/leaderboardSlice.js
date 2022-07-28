import { createSlice } from '@reduxjs/toolkit';
import { DynamoConnector } from '../../DynamoConnector';

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    listItems: [],
    lastBatchLoaded: [],
    nextCursor: null,
    isFetching: false,
    loadingState: `idle`,
  },
  reducers: {
    setLeaderboardItems: (state, action) => {
      state.listItems = action.payload;
    },
    setNextCursor: (state, action) => {
      state.nextCursor = action.payload;
    },
    setLastBatchLoaded: (state, action) => {
      const { items, cursor, type } = action.payload;
      
      state.nextCursor = cursor || null;
      
      state.listItems = state.listItems.concat(action?.payload?.items).sort((a, b) => {
        return parseFloat(b?.salt) - parseFloat(a?.salt);
      });

      state.isFetching = false;
      state.loadingState = `idle`;
    },
    setLeaderboardIsFetching: (state, action) => {
      state.isFetching = action.payload.isFetching;
      state.loadingState = action.payload.loadingState;
    },
  },
});

const prettyPrintJSON = (json) => {
  console.log(`${JSON.stringify(json, null, 4)}`);
}

export const selectLeaderboardList = (state) => state?.leaderboard?.listItems || [];
export const isLeaderboardFetching = (state) => state?.leaderboard?.isFetching || false;
export const getNextCursor = (state) => state?.leaderboard?.nextCursor || null;

// Action creators are generated for each case reducer function
export const { setLeaderboardItems, setNextCursor, setLastBatchLoaded, setLeaderboardIsFetching } = leaderboardSlice.actions;

export const fetchAll = (cursor) => (dispatch) => {
      cursor = cursor !== -1 ? cursor : null;

      cursor = cursor ? `${new URLSearchParams(cursor).toString()}` : null;

      dispatch(setLeaderboardIsFetching({
        isFetching: true,
        loadingState: cursor ? `loadingMore` : `loading`,
      }));

      DynamoConnector.getLeaderboard(
        cursor,
        (results) => {
          dispatch(setLastBatchLoaded({
            items: results.items,
            // cursor: results?.lastEvaluatedKey ? results.lastEvaluatedKey : null,
            cursor: results?.lastEvaluatedKey ? results.lastEvaluatedKey : null,
            type: null,
          }));
      });
};

export const addNewDeckToLeaderboard = (deck) => (dispatch) => {
  dispatch(setLastBatchLoaded({
    items: [ deck ],
    // cursor: results?.lastEvaluatedKey ? results.lastEvaluatedKey : null,
    cursor: getNextCursor(),
    type: 'new',
  }));
}

export const handleUpdatedDeck = (deck) => (dispatch) => {
  dispatch(setLastBatchLoaded({
    items: [ deck ],
    // cursor: results?.lastEvaluatedKey ? results.lastEvaluatedKey : null,
    cursor: getNextCursor(),
    type: 'update',
  }));
}

export default leaderboardSlice.reducer;
