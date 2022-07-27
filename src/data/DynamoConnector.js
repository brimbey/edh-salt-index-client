const getDomainPrefix = () => {
    const href = window.location.href;
    console.log(`window.location.href :: ${window.location.href}`);

    if (href.includes(`localhost`)) {
        return `http://localhost:3333`;
    } else if (href.includes(`staging`)) {
        return `https://staging-api.commandersalt.com`;
    }

    return `https://api.commandersalt.com`;
}

export const DynamoConnector = {
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
  importDeckList: async (url, statusCallback, doneCallback, errorCallback) => {
    try {
        let response = await (await fetch(`${getDomainPrefix()}/import?url=${url}`)).json()
        const commanders = Object.keys(response?.deck?.commanders);
        let saltTotal = 0;
        const nodes = response.deck.cards;
        
        const cardList = [];
        const cardnameList = [];

        Object.keys(nodes).forEach((cardname) => {
            cardnameList.push(cardname);
        })

        for (let i = 0; i < cardnameList.length; i++) {
            const cardname = cardnameList[i];
            statusCallback({type: `card`, card: cardname, percentage: Math.floor((i / cardnameList.length) * 100)});

            let data = await (await fetch(`${getDomainPrefix()}/card?card=${cardname}`)).json();
            if (data?.salt) {
                cardList.push({
                    name: cardname,
                    salt: data.salt,
                });

                saltTotal = saltTotal + parseFloat(data.salt);
            }
        }

        const persistResponse = await (await fetch(`${getDomainPrefix()}/persist`, {
            method: "POST",
            body: JSON.stringify({
                url: response?.deck?.url,
                author: response?.deck?.author?.userName,
                authorAvatarUrl: response?.deck?.author?.profileImageUrl,
                commanders,
                title: response?.deck?.name,
                salt: saltTotal,
                source: `moxfield`,
                authorProfileUrl: `https://www.moxfield.com/users/${response?.deck?.author?.userName}`,
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
    }
  }
};
