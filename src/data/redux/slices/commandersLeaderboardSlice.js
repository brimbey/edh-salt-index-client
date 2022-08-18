import { createSlice } from '@reduxjs/toolkit';
import { DynamoConnector } from '../../DynamoConnector';

export const commandersLeaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    listItems: [],
    nextCursor: null,
    isFetching: false,
    loadingState: `idle`,
  },
  reducers: {
    setCommandersLeaderboardItems: (state, action) => {
      state.listItems = action.payload;
    },
    setCommandersNextCursor: (state, action) => {
      state.nextCursor = action.payload;
    },
    addNewCommandersLeaderboardItems: (state, action) => {
      const { items, cursor, type } = action.payload;
      
      state.nextCursor = cursor || null;
      
      state.listItems = state.listItems.concat(action?.payload?.items).sort((a, b) => {
        return parseFloat(b?.salt) - parseFloat(a?.salt);
      });

      state.isFetching = false;
      state.loadingState = `idle`;
    },
    setCommandersLeaderboardIsFetching: (state, action) => {
      state.isFetching = action.payload.isFetching;
      state.loadingState = action.payload.loadingState;
    },
  },
});

const prettyPrintJSON = (json) => {
  console.log(`${JSON.stringify(json, null, 4)}`);
}
// Action creators are generated for each case reducer function
export const { setCommandersLeaderboardItems, setCommandersNextCursor, addNewCommandersLeaderboardItems, setCommandersLeaderboardIsFetching} = commandersLeaderboardSlice.actions;

export const fetchCommanderLeaderboardItems = (cursor, filters = {}, isReload = false) => (dispatch) => {
      cursor = cursor !== -1 ? cursor : null;
      cursor = cursor ? `${new URLSearchParams(cursor).toString()}` : null;

      if (isReload) {
        dispatch(setCommandersLeaderboardItems([]));
      }

      dispatch(setCommandersLeaderboardIsFetching({
        isFetching: true,
        loadingState: cursor ? `loadingMore` : `loading`,
      }));

      DynamoConnector.getCommandersLeaderboard(
        cursor,
        (results) => {
          dispatch(addNewCommandersLeaderboardItems({
            items: results.Items,
            // cursor: results?.lastEvaluatedKey ? results.lastEvaluatedKey : null,
            cursor: results?.lastEvaluatedKey ? results.lastEvaluatedKey : null,
            type: null,
          }));
      });
};

export default commandersLeaderboardSlice.reducer;
