import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Text, Flex, DialogContainer, Dialog, Divider, Well, ActionButton, View} from '@adobe/react-spectrum'
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

    const getSaltRating = (val) => {
        if (val < 10) {
            return "Grade F: WHERE IS THE SALT?!";
        } else if (val < 30) {
            return "Grade D: Under seasoned";
        } else if (val < 40) {
            return "Grade C: Pass the salt";
        } else if (val < 60) {
            return "Grade B: Well seasoned";
        } else if (val < 80) {
            return "Grade A: Completely balanced!";
        }

        return "Grade A+: PERFECTION";
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
    const maxWidth = isMobile ? "calc(100vw - 40px)" : '600px';
    const wellMaxWidth = `calc(${maxWidth} - 50px)`;
    const source = deck?.source;

    return (
        <DialogContainer type='modal' isDismissable onDismiss={() => dispatch(setPreviewIsShowingFalse())}>
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
                    <Flex direction="row" gap="size-130" marginTop="10px">
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
                            : <Flex direction="row" width="100%" justifyContent="space-between">
                                <Text UNSAFE_className="SaltRating" alignSelf="center">{getSaltRating(salt)}</Text>
                                <Flex direction="column" margin="size-0" justifyContent="center">
                                    <Text UNSAFE_className="SaltScoreHeader">SCORE</Text>
                                    <Text UNSAFE_className="SaltScore">{salt}</Text>
                                </Flex>
                            </Flex>
                        }
                    </Well>
                    <Flex direction="row" width="100%" marginTop="10px" justifyContent="space-between">
                        <ActionButton
                            width="50%" 
                            onPress={handleDeckLinkPress}><LinkOut/>
                            Deck&nbsp;&nbsp;&nbsp;
                        </ActionButton>
                        <ActionButton 
                            width="50%"
                            alignSelf="flex-end"
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
