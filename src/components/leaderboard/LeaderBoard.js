import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Cell, Column, Row, TableView, TableBody, TableHeader, Flex } from '@adobe/react-spectrum'
import { fetchAll } from '../../data/redux/slices/leaderboardSlice';
import './LeaderBoard.css';
import { setPreviewDeck, setPreviewIsShowingFalse } from '../../data/redux/slices/previewSlice';
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

export const getCellRenderer = ((item, columnKey) => {
  let content;

  if (columnKey === "authorAvatarUrl" && item.url) {
    const avatarUrl = item?.[columnKey] || `/resources/blank-user-avatar.png`;
    
    content =
      <img 
        src={avatarUrl} 
        height="26px"
        alt={item.author} 
        className="AvatarCell"  
      />
  } else if (columnKey === "commanders") {
    content = item[columnKey]?.toString().replace(`,`, `, `);
  } else {
    content = item[columnKey];
  }


  return (
    <Cell className="AvatarCell" >{content}</Cell>
  );
});

export const getColumnRenderer = ((item) => {
  let content;

  if (item.uid === "salt") {
    content =
      <Flex direction="row">
        Salt&nbsp;&nbsp;
        <img src="/resources/salt-shaker.png" height="25px" alt="Salt Score"  />
      </Flex>
  } else {
    content = item.name;
  }

  return (
    <div>
      {content}
    </div>
  );
});

export function LeaderBoard() {
  const dispatch = useDispatch();
  const listItems = useSelector((state) => state?.leaderboard?.listItems);
  const nextCursor = useSelector((state) => state?.leaderboard?.nextCursor);
  const isFetching = useSelector((state) => state?.leaderboard?.isFetching);
  const loadingState = useSelector((state) => state?.leaderboard?.loadingState);
  const isMobile = useSelector((state) => state?.app?.isMobile);

  const handleLeaderboardSelectionChange = (evn) => {
      try {
          const {currentKey} = evn;
          const selectedDeck = listItems.filter((value, index) => {
              return value.id === currentKey;
          })?.[0];
          
          if (selectedDeck) {
            dispatch(setPreviewDeck(selectedDeck));
          } else {
            dispatch(setPreviewIsShowingFalse());
          }
      } catch (error) {
          console.log(`error :: ${error}`);
      }    
  }

  const handleLoadMore = (evn) => {
    if (!isFetching && nextCursor !== null) {
      dispatch(fetchAll(nextCursor));
    }
  }

  const initialSortDescriptor = {
    column: 'salt',
    direction: 'descending',
  };
  
  const sort = async (inputObject) => {
    return {
      items: inputObject?.items?.sort((a, b) => {
        return parseFloat(b?.salt) - parseFloat(a?.salt);
      })
    };
  }

  let columns = [
    {name: 'USER', uid: 'authorAvatarUrl', maxWidth: 25},
    {name: 'Commander(s)', uid: 'commanders'},
  ];

  if (!isMobile) {
    columns.push(    
      {name: 'Title', uid: 'title'}
    );
  }
  
  columns.push(
    {name: '', uid: 'salt', width: 125}
  );

  const flexWrapperStyle = {
    display: 'inline-block',
  }
  
  if (!isMobile) {
    flexWrapperStyle["overflow-y"] = "scroll";
  }

  
  const [scrollYPosition, setScrollYPosition] = useState(true)
  const [windowSize, setWindowSize] = useState(0);

  useScrollPosition(({ prevPos, currPos }) => {
    setWindowSize({
      inner: window.innerHeight,
      outer: document.body.scrollHeight,
    })
    setScrollYPosition(-1 * currPos.y)
  }, [scrollYPosition])


  
  const handleResize = () => {
    setWindowSize({
      inner: window.innerHeight,
      outer: document.body.scrollHeight,
    })
  }

  const innerHeight = windowSize.inner || window.innerHeight;// || window.innerHeight;
  const outerHeight = windowSize.outer || document.body.scrollHeight;

  const diff = outerHeight - innerHeight;
  const maxHeight = innerHeight;
  
  let diffDiff = diff - scrollYPosition;
  diffDiff = diffDiff < 0 ? 0 : diffDiff;
  
  const tableHeight = `${innerHeight - diffDiff - 50}px`;// : "calc(100vh - 380px)";

  useEffect(() => {
      window.addEventListener('resize', handleResize, { passive: true });

      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []);
  
  return (
    <Flex direction="row">
      {/* <Flex direction="column">
        <Text>i: {innerHeight}</Text>
        <Text>s: {document.body.scrollHeight}</Text>
      </Flex> */}
      <div style={{ width: '1px', height: maxHeight }} />
      <TableView
        aria-label="All time salt index"
        density='compact'
        selectionMode="single" 
        selectionStyle="highlight"
        onSelectionChange={handleLeaderboardSelectionChange}
        sortDescriptor={initialSortDescriptor}
        onSortChange={sort}
        UNSAFE_style={{ height: tableHeight }}
        width="100%"
        marginBottom="40px"
      >
        <TableHeader columns={columns}>
          {column => (
            <Column
              key={column?.uid}
              align={column?.uid === 'authorAvatarUrl' ? 'start' : 'start'}
              maxWidth={column?.maxWidth}
              width={column?.width}
              minWidth={column?.minWidth}
            >
              {getColumnRenderer(column)}
            </Column>
          )}
        </TableHeader>
        <TableBody 
          items={listItems}
          loadingState={loadingState}
          onLoadMore={handleLoadMore}
        >
          {item => (
            <Row>
              {columnKey => getCellRenderer(item, columnKey)}
            </Row>
          )}
        </TableBody>
      </TableView>
      </Flex>
  );
}
