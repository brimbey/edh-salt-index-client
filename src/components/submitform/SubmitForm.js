import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Text, Flex, ContextualHelp, Heading, Content } from "@adobe/react-spectrum";
import "./SubmitForm.css";
import { importDeckList } from '../../data/redux/slices/importSlice';

export function SubmitForm() {
  const dispatch = useDispatch();
  const [url, setUrl] = useState(0);
  const isMobile = useSelector((state) => state.app.isMobile);
  const flexDirection = isMobile ? "column" : "row";
  
  const urlCleanedValue = url ? url?.trim() : null;
  const isDisabled = !urlCleanedValue;

  const handleOnPress = (event) => {
    dispatch(importDeckList(urlCleanedValue));
  }

  return (
    <Flex direction={flexDirection} alignItems="end" rowGap="10px" columnGap="25px" maxWidth="800px" width="calc(100vw - 30px)">
      <Flex direction="column" maxWidth="800px" width="100%" justifyContent="space-around">
        <Flex direction="row" alignItems="end" columnGap="5px" maxWidth="800px" width="100%" UNSAFE_className='submit-header' >
          <Text>Paste the URL for your decklist here!</Text>
          <ContextualHelp variant="info">
            <Heading>What can I import?</Heading>
            <Content>
              <Text>
                Currently we allow Commander legal decks from:
                <ul>
                  <li>moxfield.com</li>
                  <li>archidekt.com</li>
                  <li>tappedout.net</li>
                  <li>manabox.app</li>
                </ul>
              </Text>
            </Content>
          </ContextualHelp>
        </Flex>
        <TextField 
          onChange={(val) => { setUrl(val)}} 
          width="100%" 
          // autoFocus={true} 
        />
      </Flex>
      <Button
          variant="negative"
          isDisabled={isDisabled}
          alignSelf="flex-end"
          UNSAFE_className="submit-button"
          onPress={handleOnPress}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Get salty!
      </Button>
    </Flex>
  )
  
}