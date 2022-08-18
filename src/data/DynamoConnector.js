/* eslint-disable no-loop-func */
import { toast } from "react-toastify";

const getDomainPrefix = () => {
    const href = window.location.href;
    
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
  getCommandersLeaderboard: async (cursor, callback) => {
    let fetchUri = `${getDomainPrefix()}/commanders`;
    
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
  getLeaderboard: async (cursor, filters, callback) => {
    let fetchUri = `${getDomainPrefix()}/leaderboard`;
    
    if (cursor) {
        cursor = encodeURIComponent(cursor);
        fetchUri = `${fetchUri}?cursor=${cursor}`;
    }

    if (filters?.isFiltered) {
        if (!cursor) {
            fetchUri = `${fetchUri}?`;
        } else {
            fetchUri = `${fetchUri}&`;
        }

        fetchUri = `${fetchUri}sources=${encodeURIComponent(filters?.sources.toString())}`;

        if (filters?.query) {
            fetchUri = `${fetchUri}&query=${encodeURIComponent(filters?.query)}`;
        }
    }

    console.log(`---> fetchUri: ${fetchUri}`);
    
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

        doneCallback({
            ...response.deck,
            key: response.deck.id,
        })
    } catch (error) {
        console.log(error);
        errorCallback(error);
        toast(`${error.message}`);
    }
  }
};
