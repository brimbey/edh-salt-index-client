import React from 'react';
import { SubmitForm } from "../submitform/SubmitForm";
import { Preview } from "../preview/Preview";
import { Flex, View, Header, Divider, Text, ActionButton } from "@adobe/react-spectrum";
import { LeaderBoard } from '../leaderboard/LeaderBoard';
import { ImportStatusBar } from '../importStatusBar/ImportStatusBar';
import ShowMenu from '@spectrum-icons/workflow/ShowMenu';
import isMobile from 'ismobilejs';
import './MainView.css';

export class MainView extends React.Component {
    getUrlParam = () => {
        const href = window.location.href;
        return href.substring(href.indexOf(`?sha=`) + 5) || ``;
    }

    handleListSubmit = async (value) => {
        this.props.importDeckList(value);
    };

    componentDidMount = async () => {
        this.props.refreshLeaderboard();
        const userAgent = window.navigator['user-agent'];
        console.log(isMobile(userAgent).any);
        
        this.props.initializeApp(isMobile(userAgent).any);
    }

    render() {
        return (
            <Flex direction="column" height="100%" width="100%">
                <Flex direction="row" width="100%" gap="size-130" margin="5px">
                    <ActionButton 
                        type="reset"
                        onPress={() => {}}
                        width="size-150">
                            <ShowMenu />
                    </ActionButton>
                    <Text UNSAFE_className="HeaderText">COMMANDERSALT.COM - Your home for the saltiest MtG Commander decks!</Text>
                </Flex>
                <Divider size="M" />
                <div style={{height: "25px"}} />
                {/* <View alignItems="center"> */}
                    <Flex 
                        direction="column"  
                        alignItems="center"
                        height="100%"
                        margin="size-200"
                        gap="size-100">
                        <img src="resources/chef-kiss.png" width="100px" alt="MMM SALT!" />
                        <div style={{height: "50px"}} />
                        <Flex direction="column" width="100%" maxWidth="800px">
                            {this.props.isImporting
                                ? <ImportStatusBar />
                                : <SubmitForm listSubmitHandler={this.handleListSubmit} />// initialListUrl={param} />
                            }
                        </Flex>
                        <div style={{height: "50px"}} />
                        {this.props.showPreview 
                            ? <Preview />  
                            : <div style={{height: "0px"}} />
                        }
                        <LeaderBoard selectionHandler={this.handleLeaderboardSelectionChange}  />
                        <div style={{height: "25px"}} />
                        <View width="100%">
                            <Divider size="M" width="100%" />
                            <Header>
                                <Text size="L">Total salt miners: </Text>
                            </Header>
                        </View>
                    </Flex>
            </Flex>
        )
    }
}