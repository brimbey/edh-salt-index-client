import React from 'react';
import { SubmitForm } from "../submitform/SubmitForm";
import { Preview } from "../preview/Preview";
import { Flex, View } from "@adobe/react-spectrum";
import { LeaderBoard } from '../leaderboard/LeaderBoard';
import { ImportStatusBar } from '../importStatusBar/ImportStatusBar';
import isMobile from 'ismobilejs';
import './MainView.css';

export class MainView extends React.Component {
    getUrlParam = () => {
        const href = window.location.href;
        return href.substring(href.indexOf(`?sha=`) + 5) || ``;
    }

    componentDidMount = async () => {
        this.props.refreshLeaderboard();
        const userAgent = window.navigator['user-agent'];
        
        this.props.initializeApp(isMobile(userAgent).any);
    }

    render() {
        return (
            <Flex 
                id="MainView"
                direction="column"  
                alignItems="center"
                maxWidth="1200px"
                gap="size-100">
                <Flex direction="column" width="calc(100vw - 30px)" maxWidth="800px" marginTop="50px">
                    {this.props.isImporting
                        ? <ImportStatusBar />
                        : <SubmitForm />// initialListUrl={param} />
                    }
                </Flex>
                <div style={{height: "10px"}} />
                {this.props.showPreview 
                    ? <Preview />  
                    : <div style={{height: "0px"}} />
                }
                <View width="100%">
                    <LeaderBoard selectionHandler={this.handleLeaderboardSelectionChange}  />
                </View>
             </Flex>
        )
    }
}