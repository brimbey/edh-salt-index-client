import { createSlice } from '@reduxjs/toolkit';
import { DynamoConnector } from '../../DynamoConnector';

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    listItems: [],
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
    addNewItems: (state, action) => {
      const { items, cursor, type } = action.payload;
      
      state.nextCursor = cursor || null;
      
      state.listItems = state.listItems.concat(action?.payload?.items).sort((a, b) => {
        return parseFloat(b?.salt) - parseFloat(a?.salt);
      });

      state.isFetching = false;
      state.loadingState = `idle`;
    },
    updateExistingItem: (state, action) => {
      const updatedItem = action.payload;
      state.listItems = state.listItems.map((item) => {
        if (item.id === updatedItem.id) {
          return updatedItem;
        }
        return item;
      });

      state.listItems = state.listItems.sort((a, b) => {
        return parseFloat(b?.salt) - parseFloat(a?.salt);
      });
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
export const { setLeaderboardItems, setNextCursor, addNewItems, setLeaderboardIsFetching, updateExistingItem } = leaderboardSlice.actions;

export const doHardReload = () => (dispatch) => {
  dispatch(setLeaderboardItems([]));
  dispatch(setLeaderboardIsFetching({
    isFetching: true,
    loadingState: `loading`,
  }));

  DynamoConnector.getLeaderboard(
    null,
    (results) => {
      dispatch(addNewItems({
        items: results.items,
        cursor: results?.lastEvaluatedKey ? results.lastEvaluatedKey : null,
        type: null,
      }));
  });
};

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
          dispatch(addNewItems({
            items: results.items,
            // cursor: results?.lastEvaluatedKey ? results.lastEvaluatedKey : null,
            cursor: results?.lastEvaluatedKey ? results.lastEvaluatedKey : null,
            type: null,
          }));
      });
};

export const addNewDeckToLeaderboard = (deck) => (dispatch) => {
  dispatch(addNewItems({
    items: [ deck ],
    // cursor: results?.lastEvaluatedKey ? results.lastEvaluatedKey : null,
    cursor: getNextCursor(),
    type: 'new',
  }));
}

export const handleUpdatedDeck = (deck) => (dispatch) => {
  dispatch(updateExistingItem(deck));
}

export default leaderboardSlice.reducer;
