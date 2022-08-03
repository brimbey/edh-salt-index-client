/* eslint-disable no-loop-func */
import { toast } from "react-toastify";

const getDomainPrefix = () => {
    const href = window.location.href;
    console.log(`window.location.href :: ${window.location.href}`);

    if (href.includes(`localhost`)) {
        if (href.includes(`useStaging=true`)) {
            return `https://staging-api.commandersalt.com`;    
        }

        return `http://localhost:3333`;
    } else if (href.includes(`staging`)) {
        return `https://staging-api.commandersalt.com`;
    }

    return `https://api.commandersalt.com`;
}

export const DynamoConnector = {
  getStats: async (callback) => {
    let fetchUri = `${getDomainPrefix()}/stats`;

    const results = await (await fetch(fetchUri, {
        method: "GET",
        headers: {
            "Content-type": "application/json;charset=UTF-8",
        }
      })).json();

    callback(results);
  },
  getLeaderboard: async (cursor, callback) => {
    let fetchUri = `${getDomainPrefix()}/leaderboard`;

    if (cursor) {
        cursor = encodeURIComponent(cursor);
        fetchUri = `${fetchUri}?cursor=${cursor}`;
    }
    
    const results = await (await fetch(fetchUri, {
        method: "GET",
        headers: {
            "Content-type": "application/json;charset=UTF-8",
        }
      })).json();

    callback(results);
  },
  fetchCardInList: async (cardname, finishedCallback) => {
    try {
        let response = null;
        try {
            await (
                response = await fetch(`${getDomainPrefix()}/card?card=${encodeURIComponent(cardname)}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json;charset=UTF-8",
                    }
                })
            )
        } catch (error) {
            // sometimes the response fails... try one more time just to be sure
            response = await fetch(`${getDomainPrefix()}/card?card=${encodeURIComponent(cardname)}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json;charset=UTF-8",
                }
            })
        }

        await response.json().then((data) => {
            finishedCallback(data);
        })
    } catch (error) {
        console.log(`failed to get ${cardname}`);
        finishedCallback({})
    }
  },
  importDeckList: async (url, statusCallback, doneCallback, errorCallback) => {
    try {
        const cardList = [];
        const cardnameList = [];
        let saltTotal = 0;

        statusCallback(
            {
                type: `card`, 
                card: 'Loading...', 
                percentage: 1,
            }
        );

        const request = await fetch(`${getDomainPrefix()}/import?url=${url}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json;charset=UTF-8",
            }
          });
        const response = await request.json()

        if (request.status !== 200) {
            throw response;
        }   

        const commanders = Object.keys(response?.deck?.commanders);
        const nodes = response.deck.cards;
        
        Object.keys(nodes).forEach((cardname) => {
            cardnameList.push(cardname);
        })

        const promises = [];
        const fetchFinishedHandler = async (data) => {
            if (data?.salt) {
                cardList.push(data);

                statusCallback(
                    {
                        type: `card`, 
                        card: data.name, 
                        percentage: Math.floor((cardList.length / cardnameList.length) * 100)
                    }
                );
        
                saltTotal = saltTotal + parseFloat(data.salt);
            }
        }

        for (let i = 0; i < cardnameList.length; i++) {
            const cardname = cardnameList[i];
            promises.push(DynamoConnector.fetchCardInList(cardname, fetchFinishedHandler));
        }

        await Promise.all(promises);

        const persistResponse = await (await fetch(`${getDomainPrefix()}/persist`, {
            method: "POST",
            body: JSON.stringify({
                url: response?.deck?.url,
                author: response?.deck?.author?.userName,
                authorAvatarUrl: response?.deck?.author?.profileImageUrl,
                commanders,
                title: response?.deck?.name,
                salt: saltTotal,
                source: response?.deck?.source,
                authorProfileUrl: response?.deck?.author?.url,
            })
        })).json();

        doneCallback({
            ...persistResponse.data,
            id: persistResponse.id,
            key: persistResponse.id,
            salt: persistResponse?.data?.salt,
        });
    } catch (error) {
        console.log(error);
        errorCallback(error);
        toast(`${error.message}`);
    }
  }
};
