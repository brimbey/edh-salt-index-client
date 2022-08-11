import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Text, Flex, ContextualHelp, Heading, Content, MenuTrigger, ActionButton, Menu, Item, SearchField, CheckboxGroup, Checkbox, DialogTrigger, Dialog } from "@adobe/react-spectrum";
import "./FilterPanel.css";
import { importDeckList } from '../../data/redux/slices/importSlice';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';
import ChevronDown from '@spectrum-icons/workflow/ChevronDown';
import CloseCircle from '@spectrum-icons/workflow/CloseCircle';
import GlobeGrid from '@spectrum-icons/workflow/GlobeGrid';
import { fetchFiltered } from '../../data/redux/slices/leaderboardSlice';

export function FilterPanel() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState(0);
  const isMobile = useSelector((state) => state.app.isMobile);
  const hasFilters = useSelector((state) => state.leaderboard.filters.isFiltered);
  const sources = useSelector((state) => state.leaderboard.filters.sources);
  
  // bit is flipped because it checks for positive case of negative value
  const canClear = hasFilters ? false : true;

  const dispatchFilteredQuery = () => {
    dispatch(fetchFiltered({
      query,
      sources,
    }));
  }

  const handleSourceOnChange = (evn) => {
    dispatch(fetchFiltered({
      query,
      sources: evn,
    }));
  }
  
  const [isOpen, setIsOpen] = useState(0);
  const maxHeight = isOpen ? "95px" : "25px";
  // const searchAndClearFlexDirection = isMobile ? "column" : "row"
  
  return (
    <Flex direction="column" maxHeight={maxHeight} height={maxHeight} UNSAFE_style={{ overflow: 'hidden', paddingLeft: '15px' }}  maxWidth="800px" width="calc(100vw - 30px)">
      <Flex direction="row" alignItems="start" columnGap="40px">
        <ActionButton
          isQuiet
          onPress={() => setIsOpen(isOpen ? false : true)} height="20px" marginBottom="5px">
          {isOpen
            ? <ChevronDown />
            : <ChevronRight />
          }
          <Text UNSAFE_className='filters-header'>FILTERS</Text>
        </ActionButton>
      </Flex>
      <Flex direction="row" width="100%" rowGap="10px" columnGap="25px" justifyContent="space-between">
        <Flex direction="column" justifyContent="space-around">
          <Text UNSAFE_className='filters-sources-header'>Sources</Text>
          <DialogTrigger type="popover" mobileType="modal" >
            <ActionButton>
                    <GlobeGrid />
            </ActionButton>
            {(close) => (
                <Dialog UNSAFE_style={{ maxWidth: "150px" }} >
                  <div style={{ paddingLeft: '20px', paddingTop: '10px' }}>
                    <CheckboxGroup
                      value={sources}
                      onChange={handleSourceOnChange}
                    >
                      <Checkbox value="www.moxfield.com">moxfield.com</Checkbox>
                      <Checkbox value="www.archidekt.com">archidekt.com</Checkbox>
                      <Checkbox value="www.tappedout.net">tappedout.net</Checkbox>
                      <Checkbox value="www.manabox.app">manabox.app</Checkbox>
                    </CheckboxGroup>
                  </div>
                </Dialog>
            )}
          </DialogTrigger>
        </Flex>
        <Flex direction="column" width="100%">
          <Flex direction="row" columnGap="10px">
            <Text UNSAFE_className='filters-sources-header'>Search</Text>
            <ContextualHelp variant="info">
              <Heading>Search queries</Heading>
              <Content>
                <Text>
                  Currently you may search for:
                  <ul>
                    <li>Author names</li>
                    <li>Deck titles</li>
                    <li>Commander names</li>
                  </ul>
                  You may also use partial queries (e.g. "rima" will return entries including "Brimaz").
                </Text>
              </Content>
            </ContextualHelp>
          </Flex>
          <SearchField 
            onChange={setQuery}
            onSubmit={() => { dispatchFilteredQuery() }} 
            onClear={() => { 
              dispatch(
                fetchFiltered({
                  query: "",
                  sources,
                }))}}
            width="100%"
          />
        </Flex>
        {/* <ActionButton
          alignSelf="flex-end"
          isQuiet
          isDisabled={canClear}
          onPress={() => setIsOpen(isOpen ? false : true)} height="20px" marginBottom="5px">
            <CloseCircle />
          <Text UNSAFE_className='filters-header'>Clear&nbsp;&nbsp;</Text>
        </ActionButton> */}
      </Flex>
    </Flex>
  )
  
}