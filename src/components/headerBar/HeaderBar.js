import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Divider, Text, ActionButton, DialogTrigger, Dialog, Heading, Content, Button } from "@adobe/react-spectrum";
import ShowMenu from '@spectrum-icons/workflow/ShowMenu';
import {
    Link,
  } from 'react-router-dom';
import './HeaderBar.css';
import { setAppRoute } from '../../data/redux/slices/appSlice';



export function HeaderBar() {
    const dispatch = useDispatch();

    const isMobile = useSelector((state) => state.app.isMobile);
    const deckCount = useSelector((state) => state?.app?.stats?.total);
    const title = useSelector((state) => state?.app?.route?.title);
    const headerClassName = (isMobile) ? "layered-image-mobile" : "layered-image";
    const deckCountString = deckCount > 0 ? `${deckCount} salty ass decks indexed...` : ` `;

    const handleMenuClick = (route, closeMethod) => {
        dispatch(setAppRoute(route));
        // navigate(route);     
        closeMethod();
    }

    return (
        <Flex 
            width="100%"
            direction="column"  
            alignItems="center">
            <Flex direction="row" width="100%" margin="5px" justifyContent="space-between">
                <Flex direction="row">
                    <img src="resources/chef-kiss-header.png" width="40px" height="40px" alt="MMM SALT!" style={{ paddingLeft: '10px', paddingRight: '20px' }} />
                    <Text UNSAFE_className="HeaderText">COMMANDERSALT.COM</Text>
                </Flex>
                <span style={{ marginRight: "20px", alignSelf:"center" }} > 
                    <DialogTrigger type="popover">
                        <ActionButton
                            type="reset"
                            width="size-150">
                                <ShowMenu />
                        </ActionButton>
                        {(close) => (
                            <Dialog>
                                <Heading UNSAFE_style={{ 'font-size': '12px', 'font-weight': 'bolder', 'color': 'red' }}>commandersalt</Heading>
                                <Divider />
                                <Content>
                                    <Flex direction="column">
                                        <Link 
                                            to="/" 
                                            onClick={() => { 
                                                handleMenuClick(`/`, close); 
                                            } }>
                                            Leaderboard
                                        </Link>
                                        <Link 
                                            to="/why" 
                                            onClick={() => { 
                                                handleMenuClick(`/why`, close); 
                                            } }>
                                            But... why?
                                        </Link>
                                    </Flex>
                                </Content>
                            </Dialog>
                        )}
                    </DialogTrigger>
                </span>
            </Flex>
            <Flex direction="column" UNSAFE_className={headerClassName}>
                <div class="leaderboard-title">
                    { title }
                </div>
                <div class="leaderboard-subtitle">
                    {deckCountString}
                </div>
            </Flex>
        </Flex>
    );     
}