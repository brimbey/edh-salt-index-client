import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Cell, Column, Row, TableView, TableBody, TableHeader, Flex } from '@adobe/react-spectrum'
import { fetchAll } from '../../data/redux/slices/leaderboardSlice';
import './Commanders.css';
import { setPreviewDeck, setPreviewIsShowingFalse } from '../../data/redux/slices/previewSlice';
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { FilterPanel } from '../filterpanel/FilterPanel';
import { fetchCommanderLeaderboardItems } from '../../data/redux/slices/commandersLeaderboardSlice';


export const getCellRenderer = ((item, columnKey) => {
  let content;

  if (columnKey === "authorAvatarUrl" && item.url) {
    console.log(`ITEM :: ${item}`);
    const avatarUrl = item?.author?.profileImageUrl || `/resources/blank-user-avatar.png`;
    
    return (
      <Cell>
        <div className='AvatarCell'>
          <img 
            src={avatarUrl} 
            height="50px"
            alt={item.author?.username} 
            className="AvatarCell"  
          />
        </div>
      </Cell>
    )
  } else if (columnKey === "salt") {
    const floatValue = parseFloat(item[columnKey]).toFixed(3);
    const percentage = floatValue / 100;
    const colorPercentage = percentage * 80;
    const colorValue = Math.ceil(80 - colorPercentage);
    const colorCss = `hsl(${colorValue} 100% 50%)`;

    return (
      <Cell>
        <div className='SaltCell' style={{ color: colorCss }}>
          {floatValue}
        </div>
      </Cell>
    )
  } else {
    content = item[columnKey];
  }


  return (
    <Cell>
      <div className='TextCell'>
        {content}
      </div>
    </Cell>
  );
});

export const getColumnRenderer = ((item) => {
  let content;

  if (item.uid === "salt") {
    content =
      <Flex direction="row">
        Average Salt&nbsp;&nbsp;
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

export function Commanders() {
  const dispatch = useDispatch();
  const listItems = useSelector((state) => state?.commandersLeaderboard?.listItems);
  const nextCursor = useSelector((state) => state?.commandersLeaderboard?.nextCursor);
  const isFetching = useSelector((state) => state?.commandersLeaderboard?.isFetching);
  const loadingState = useSelector((state) => state?.commandersLeaderboard?.loadingState);
  const isMobile = useSelector((state) => state?.app?.isMobile);

  console.log(`GOT ITEMS`);
  console.log(JSON.stringify(listItems));

  const handleLeaderboardSelectionChange = (evn) => {
      try {
          const {currentKey} = evn;
          const selectedDeck = listItems.filter((value, index) => {
              return value?.id === currentKey;
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
      dispatch(fetchCommanderLeaderboardItems(nextCursor));
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
    {name: 'Commander(s)', uid: 'commanders'},
    {name: 'Count', uid: 'count', width: 125},
    {name: '', uid: 'salt', width: 125},
  ];

  const flexWrapperStyle = {
    display: 'inline-block',
  }
  
  if (!isMobile) {
    flexWrapperStyle["overflow-y"] = "scroll";
  }

  
  const [scrollYPosition, setScrollYPosition] = useState(true)
  const [windowSize, setWindowSize] = useState(0);

  const handleResize = () => {
    setWindowSize({
      inner: window.innerHeight,
      outer: document.body.scrollHeight,
    })
  }

  useScrollPosition(({ prevPos, currPos }) => {
    handleResize()
    setScrollYPosition(-1 * currPos.y)
  }, [scrollYPosition])

  const innerHeight = windowSize.inner || window.innerHeight;// || window.innerHeight;
  const outerHeight = windowSize.outer || document.body.scrollHeight;

  const diff = outerHeight - innerHeight;
  const maxHeight = innerHeight;
  
  let diffDiff = diff - scrollYPosition;
  diffDiff = diffDiff < 0 ? 0 : diffDiff;
  
  const tableHeight = `${innerHeight - diffDiff - 95}px`;// : "calc(100vh - 380px)";

  useEffect(() => {
      window.addEventListener('resize', handleResize, { passive: true });

      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []);
  
  return (
    <Flex direction="row" marginTop="50px">
      {/* <Flex direction="column">
        <Text>i: {innerHeight}</Text>
        <Text>s: {document.body.scrollHeight}</Text>
      </Flex> */}
      <div style={{ width: '1px', height: maxHeight }} />
      <Flex direction="column" width="100%">
        <TableView
         overflowMode="wrap"
          aria-label="All time salt index"
          density='compact'
          selectionMode="single" 
          selectionStyle="highlight"
          onSelectionChange={handleLeaderboardSelectionChange}
          sortDescriptor={initialSortDescriptor}
          onSortChange={sort}
          UNSAFE_style={{ height: tableHeight }}
          width="100%"
        >
          <TableHeader columns={columns}>
            {column => (
              <Column
                key={column?.uid}
                align='start'
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
    </Flex>
  );
}
