import { connect } from 'react-redux';
import { MainView } from './MainView';
import { doHardReload, fetchAll } from '../../data/redux/slices/leaderboardSlice';
import { importDeckList, importPercentageDone, isImporting } from '../../data/redux/slices/importSlice';
import { isPreviewShowing } from '../../data/redux/slices/previewSlice';
import { getAppStats, setIsMobile } from '../../data/redux/slices/appSlice';


const mapStateToProps = (state) => {
    const props = {};

    try {
        props.isMobile = state?.app?.isMobile;
        props.isImporting = isImporting(state);
        props.importPercentageDone = importPercentageDone(state);
        props.showPreview = isPreviewShowing(state);
        props.totalDecksCount = state?.app?.stats?.total;
    } catch (error) {
        // swallow error
    }

    return props;
};

const mapDispatchToProps = (dispatch) => ({
  initializeApp(isMobile) {
    dispatch(setIsMobile(isMobile));
    dispatch(getAppStats());
  },
  refreshLeaderboard() {
    dispatch(fetchAll(null, {}, true));
  },
  importDeckList(uri) {
    // dispatch(importDeckList(uri));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
