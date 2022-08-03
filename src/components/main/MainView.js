import React from 'react';
import { SubmitForm } from "../submitform/SubmitForm";
import { Preview } from "../preview/Preview";
import { Flex, View, Header, Divider, Text, ActionButton, Toast } from "@adobe/react-spectrum";
// import { Toast } from '@spectrum-web-components/toast';
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
        const headerClassName = this.props.isMobile ? "layered-image-mobile" : "layered-image";
        const deckCountString = this?.props?.totalDecksCount > 0 ? `${this.props.totalDecksCount} salty ass decks indexed...` : ` `;

        return (
            <Flex direction="column" height="100%" width="100%">
                <Flex direction="row" width="100%" gap="size-130" margin="5px" justifyContent="space-between">
                    <Flex direction="row" gap="size-200" margin="5px">
                        <img src="resources/chef-kiss-header.png" width="40px" height="40px" alt="MMM SALT!" />
                        <Text UNSAFE_className="HeaderText">COMMANDERSALT.COM</Text>
                    </Flex>
                    <span style={{ marginRight: "20px", alignSelf:"center" }} >
                        <ActionButton
                            type="reset"
                            onPress={() => {}}
                            width="size-150">
                                <ShowMenu />
                        </ActionButton>
                    </span>
                </Flex>
                <Divider size="M" width="100%" />
                    <Flex 
                        direction="column"  
                        alignItems="center"
                        height="100%"
                        marginRight="0px" marginLeft="0px" id="FART"
                        gap="size-100">
                        <Flex direction="column" UNSAFE_className={headerClassName}>
                            <div class="leaderboard-title">
                                Leaderboard
                            </div>
                            <div class="leaderboard-subtitle">
                                {deckCountString}
                            </div>
                        </Flex>
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
                        <LeaderBoard selectionHandler={this.handleLeaderboardSelectionChange}  />
                        <div style={{height: "25px"}} />
                        <View width="100%">
                            <Divider size="M" width="100%" />
                            <Header>
                                <Text size="L">-- </Text>
                            </Header>
                        </View>
                    </Flex>
            </Flex>
        )
    }
}