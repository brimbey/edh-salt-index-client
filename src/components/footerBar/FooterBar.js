import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header, Divider, Text, View } from "@adobe/react-spectrum";
import ShowMenu from '@spectrum-icons/workflow/ShowMenu';
import {
    Link,
  } from 'react-router-dom';
import './FooterBar.css';
import { setAppRoute } from '../../data/redux/slices/appSlice';



export function FooterBar() {
    const dispatch = useDispatch();

    const isMobile = useSelector((state) => state.app.isMobile);
    const deckCount = useSelector((state) => state?.app?.stats?.total);
    const deckCountString = deckCount > 0 ? `${deckCount} salty ass decks indexed...` : ` `;

    return (
        <View width="100%" UNSAFE_style={{ position: 'fixed', bottom: '0', backgroundColor: '#1e1e1e', height: '40px' }}>
            <Divider size="M" width="100%" />
            <Header>
                <Text alignSelf="flex-end" UNSAFE_className='footerText'>{deckCountString}</Text>
            </Header>
        </View>
    );     
}