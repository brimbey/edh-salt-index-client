import React from 'react';
import { SubmitForm } from "../submitform/SubmitForm";
import { Preview } from "../preview/Preview";
import { Flex, View, Header, Divider, Text } from "@adobe/react-spectrum";
// import { Toast } from '@spectrum-web-components/toast';
import { LeaderBoard } from '../leaderboard/LeaderBoard';
import { ImportStatusBar } from '../importStatusBar/ImportStatusBar';
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
        const headerClassName = this.props.isMobile ? "layered-image-mobile" : "layered-image";
        const deckCountString = this?.props?.totalDecksCount > 0 ? `${this.props.totalDecksCount} salty ass decks indexed...` : ` `;

        return (
            <Flex 
                id="MainView"
                direction="column"  
                alignItems="center"
                maxWidth="1200px"
                gap="size-100">
                <Flex direction="column" width="100%" maxWidth="800px" marginTop="50px">
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
                <View width="100%">
                    <LeaderBoard selectionHandler={this.handleLeaderboardSelectionChange}  />
                </View>
                <div style={{height: "25px"}} />
                <View width="100%">
                    <Divider size="M" width="100%" />
                    <Header>
                        <Text size="L">-- </Text>
                    </Header>
                </View>
             </Flex>
        )
    }
}