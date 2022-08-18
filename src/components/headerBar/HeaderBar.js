import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Divider, Text, ActionButton, DialogTrigger, Dialog, Heading, Content} from "@adobe/react-spectrum";
import ShowMenu from '@spectrum-icons/workflow/ShowMenu';
import {
    Link,
  } from 'react-router-dom';
import './HeaderBar.css';
import { setAppRoute } from '../../data/redux/slices/appSlice';
// import history from '../../data/history'



export function HeaderBar() {
    const dispatch = useDispatch();

    const isMobile = useSelector((state) => state.app.isMobile);
    const title = useSelector((state) => state?.app?.route?.title);
    const headerClassName = (isMobile) ? "layered-image-mobile" : "layered-image";
    const headerCaption = "Let that sweet salt flow!";

    const handleMenuClick = (route, closeMethod) => {
        dispatch(setAppRoute(route));
        // navigate(route);
        // history.push(route);
        closeMethod();
    }

    return (
        <Flex 
            width="100%"
            direction="column"  
            alignItems="center">
            <Flex direction="row" width="100%" margin="5px" justifyContent="space-between" height="54px">
                <Flex direction="row">
                    <img src="resources/chef-kiss-header.png" width="40px" height="40px" alt="MMM SALT!" style={{ paddingLeft: '10px', paddingRight: '20px' }} />
                    <Text UNSAFE_className="HeaderText">COMMANDERSALT.COM</Text>
                </Flex>
                <span style={{ marginRight: "20px", alignSelf:"center" }} > 
                    <DialogTrigger type="popover" mobileType="tray" >
                        <ActionButton
                            type="reset"
                            width="size-150">
                                <ShowMenu />
                        </ActionButton>
                        {(close) => (
                            <Dialog>
                                <Heading UNSAFE_style={{ 'font-size': '12px', 'font-weight': 'bolder', 'color': 'red' }}>commandersalt</Heading>
                                <Divider />
                                <Content
                                    minHeight="100vh">
                                    <Flex direction="column">
                                        <nav>
                                            <Link 
                                                to="/" 
                                                onClick={() => { 
                                                    handleMenuClick(`/`, close); 
                                                } }>
                                                Leaderboard
                                            </Link>
                                        </nav>
                                        <nav>
                                            <Link 
                                                to="/commanders" 
                                                onClick={() => { 
                                                    handleMenuClick(`/commanders`, close); 
                                                } }>
                                                Commanders
                                            </Link>
                                        </nav>
                                        <nav>
                                        <Link 
                                            to="/why" 
                                            onClick={() => { 
                                                handleMenuClick(`/why`, close); 
                                            } }>
                                            But... why?
                                        </Link>
                                        </nav>
                                    </Flex>
                                </Content>
                            </Dialog>
                        )}
                    </DialogTrigger>
                </span>
            </Flex>
            <Flex direction="column" UNSAFE_className={headerClassName}>
                <div className="leaderboard-title">
                    { title }
                </div>
                <div className="leaderboard-subtitle">
                    {headerCaption}
                </div>
            </Flex>
        </Flex>
    );     
}