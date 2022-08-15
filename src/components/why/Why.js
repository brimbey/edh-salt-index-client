import React from 'react';
import { SubmitForm } from "../submitform/SubmitForm";
import { Preview } from "../preview/Preview";
import { Flex, View, Header, Divider, Text, Heading } from "@adobe/react-spectrum";
import './Why.css';

export function Why() {
    return (
            <Flex 
                direction="column"  
                alignItems="baseline"
                height="100%"
                marginRight="0px" 
                marginLeft="0px"
                maxWidth="800px"
                gap="size-100">
                <h1>Why does this exist?!</h1>
                <Text>
                    The idea for this site started because my core playgroup enjoyed making our decks as salty as we could. Naturally, this turned in to a competition.
                </Text>
                <Text>
                    As the competition evolved, the question of how to fully quantify a deck's salt level became more and more of a question. We were, of course, intimately familiar with 
                    edhrec.com's famous salt list. In fact, a couple of us used it as a deck building tool. Given that - the solution was fairly obvious. I made a node script that aggregated 
                    a deck's overall salt score based on the scores of it's constituent cards.
                </Text>
                <Text>
                    We showed this sfd;lksdf ;ksfsd;lkf sdlfk ds;lf'lsd f'sdl fsdlkf sd;lfks df;ldsk dflskdfj sdlkfj dslkfsdkj f;dks sl;d as;dk ewpokda s;kd s;ldfsk to a few other people that we played with in our lgs, and quickly realized that the idea was amusing enough that other people wanted to participate.
                </Text>
                <Text>
                    Thus... <i>this</i>.
                </Text>
            </Flex>
    )
}