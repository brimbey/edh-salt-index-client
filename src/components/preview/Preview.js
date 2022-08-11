import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Text, Flex, DialogContainer, Well, ActionButton, View} from '@adobe/react-spectrum'
import './Preview.css';
import LinkOut from '@spectrum-icons/workflow/LinkOut';
import Close from '@spectrum-icons/workflow/Close';
import Refresh from '@spectrum-icons/workflow/Refresh';
import { setPreviewIsShowingFalse } from '../../data/redux/slices/previewSlice';
import { ImportStatusBar } from '../importStatusBar/ImportStatusBar';
import { doRefresh } from '../../data/redux/slices/importSlice';


export function Preview() {
    const deck = useSelector((state) => state.preview.previewDeck);
    const isRefreshing = useSelector((state) => state.import.isRefreshing);
    const isImporting = useSelector((state) => state.import.isImporting);
    const isMobile = useSelector((state) => state.app.isMobile);

    const dispatch = useDispatch();

    const handleAuthorLinkPress = (evn) => {
        window.open(deck.authorProfileUrl, `_blank`);
      }

    const handleDeckLinkPress = (evn) => {
        window.open(deck.url, `_blank`);
      }

    const getSaltGrade = (val) => {
        if (val < 10) {
            return "F";
        } else if (val < 30) {
            return "D";
        } else if (val < 40) {
            return "C";
        } else if (val < 60) {
            return "B";
        } else if (val < 80) {
            return "A";
        }

        return "A+";
    }

    const getSaltRating = (val) => {
        if (val < 10) {
            return "MOAR SALT!";
        } else if (val < 30) {
            return "Under seasoned";
        } else if (val < 40) {
            return "Pass the salt";
        } else if (val < 60) {
            return "Well seasoned";
        } else if (val < 80) {
            return "Pure artistry!";
        }

        return "PERFECTION";
      }

    const avatarUrl = deck?.authorAvatarUrl;
    const title = deck?.title;
    const salt = deck?.salt;
    const author = deck?.author;
    let commanderList = deck?.commanders;
    if (!Array.isArray(commanderList)) {
        commanderList = [deck?.commanders];
    }
    console.log(`commanderList :: ${commanderList}`);
    let commanders = ``; 
    commanderList.forEach((commander) => {
        if (commanders === ``) {
            commanders = commander;
        } else {
            commanders = `${commanders}\n${commander}`
        }
    })

    
    deck?.commanders?.toString().replace(`,`, `\n`);
    const maxWidth = isMobile ? "calc(100vw - 40px)" : '500px';
    const wellMaxWidth = `calc(${maxWidth} - 50px)`;
    const source = deck?.source;
    const authorUrlButtonDisabled = !deck?.authorProfileUrl;

    return (
        <DialogContainer type='modal'>
            <div className='PreviewContainer' style={{ width: maxWidth, maxWidth: "600px" }}>
                <Flex direction="column" width="100%">
                    <View UNSAFE_className='PreviewContainerHeader' padding="10px">
                        <Flex direction="row" width="100%">
                            <Text UNSAFE_className="TitleText">{title}</Text>
                            <Flex direction="row" gap="size-100" justifyContent="right">
                                <ActionButton 
                                    type="reset"
                                    alignSelf="flex-end"
                                    isDisabled={isImporting || isRefreshing}
                                    onPress={() => dispatch(doRefresh(deck.url))}><Refresh /></ActionButton>
                                <ActionButton 
                                    type="reset"
                                    alignSelf="flex-end"
                                    onPress={() => dispatch(setPreviewIsShowingFalse())}><Close /></ActionButton>
                            </Flex>
                        </Flex>
                    </View>
                    <Flex direction="row" gap="size-130" marginTop="10px" UNSAFE_style={{ padding: "0px 10px 0px 10px" }}>
                        <Flex direction="column">
                            <img src={avatarUrl || `/resources/blank-user-avatar.png`} width="100" alt="avatar" />
                            <Text UNSAFE_className="AuthorText">{author}</Text>
                        </Flex>
                        <Flex direction="column" width="100%">
                            <Text UNSAFE_className="PropertyHeader">Commander(s):</Text>
                            <div style={{height: '10px'}} />
                            <Text UNSAFE_className="PropertyLabel">{commanders}</Text>
                            <div style={{height: '100%'}} />
                            <Text UNSAFE_className="PropertyHeader">Source:</Text>
                            <div style={{height: '10px'}} />
                            <Text UNSAFE_className="PropertyLabel">{source}</Text>
                            <div style={{height: '100%'}} />
                        </Flex>
                    </Flex>
                    
                    <Well alignSelf="center" UNSAFE_style={{ width: '100%', maxWidth: wellMaxWidth }}>
                        {isRefreshing
                            ?   <div style={{marginTop: '5px'}}>
                                    <ImportStatusBar paddingTop="10px" />  
                                </div>
                            : <Flex direction="column" rowGap="30px">
                                <Flex direction="column" margin="size-0" justifyContent="center" alignContent="center" width="100%">
                                    <Text UNSAFE_className="SaltScoreHeader" alignSelf="center">OUR CHEF'S REMARKS</Text>
                                    <Text UNSAFE_className="FlavorProfile" alignSelf="center">{getSaltRating(salt)}</Text>
                                </Flex>
                                <Flex direction="row" width="100%" columnGap="30px" justifyContent="center">
                                    <Flex direction="column" margin="size-0" justifyContent="center" width="300px">
                                        <Text UNSAFE_className="SaltScoreHeader" alignSelf="center">GRADE</Text>
                                        <Text UNSAFE_className="SaltScore" alignSelf="center">{getSaltGrade(salt)}</Text>
                                    </Flex>
                                    <Flex direction="column" margin="size-0" justifyContent="center" width="300px">
                                        <Text UNSAFE_className="SaltScoreHeader" alignSelf="center">SCORE</Text>
                                        <Text UNSAFE_className="SaltScore" alignSelf="center">{salt}</Text>
                                    </Flex>
                                </Flex>
                            </Flex>
                        }
                    </Well>
                    <Flex direction="row" width="100%" marginTop="10px" marginBottom="5px" justifyContent="space-between" >
                        <ActionButton
                            margin="0px 5px 0px 10px"
                            width="50%" 
                            onPress={handleDeckLinkPress}><LinkOut/>
                            Deck&nbsp;&nbsp;&nbsp;
                        </ActionButton>
                        <ActionButton 
                            margin="0px 10px 0px 5px"
                            width="50%"
                            alignSelf="flex-end"
                            isDisabled={authorUrlButtonDisabled}
                            onPress={handleAuthorLinkPress}>
                                <LinkOut/>
                                Author Profile&nbsp;&nbsp;&nbsp;
                        </ActionButton>
                    </Flex>
                </Flex>
            </div>
        </DialogContainer>
    )
}
