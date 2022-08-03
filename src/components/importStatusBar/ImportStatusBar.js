import React from 'react';
import { useSelector } from 'react-redux';
import { ProgressBar } from "@adobe/react-spectrum";

export function ImportStatusBar() {
  const isRefreshing = useSelector((state) => state.import.isRefreshing);
  const progress = useSelector((state) => state.import.importing.percentageLoaded);
  const isRefreshingProgress = useSelector((state) => state.import.refreshing.percentageLoaded);

  const cardname = useSelector((state) => state.import.importing.current);
  const isRefreshingCardname = useSelector((state) => state.import.refreshing.current);

  return (
    <ProgressBar value={(isRefreshing) ? isRefreshingProgress : progress} label={(isRefreshing) ? isRefreshingCardname : cardname}  width="100%" />
  );
}
