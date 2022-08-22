import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header, Divider, Text, View } from "@adobe/react-spectrum";
import ShowMenu from '@spectrum-icons/workflow/ShowMenu';
import {
    Link,
  } from 'react-router-dom';
import './FooterBar.css';



export function FooterBar() {
    const dispatch = useDispatch();

    const listItems = useSelector((state) => state?.leaderboard?.listItems);
    const deckCount = useSelector((state) => state?.app?.stats?.total);
    const deckCountString = deckCount > 0 ? `Showing ${listItems.length} out of ${deckCount} salty ass decks indexed...` : ` `;

    return (
        <View width="100%" UNSAFE_style={{ position: 'fixed', bottom: '0', backgroundColor: '#1e1e1e', height: '40px' }}>
            <Divider size="M" width="100%" />
            <Header>
                <Text alignSelf="flex-end" UNSAFE_className='footerText'>{deckCountString}</Text>
            </Header>
        </View>
    );     
}