import fetch from '../core/fetch';

function createGraphqlRequest(fetchKnowingCookie) {
  return async function graphqlRequest(query, variables) {
    const fetchConfig = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      credentials: 'include',
    };
    const resp = await fetchKnowingCookie('/graphql', fetchConfig);
    if (resp.status !== 200) throw new Error(resp.statusText);
    return await resp.json();
  };
}

function createFetchKnowingCookie({ cookie }) {
  if (!process.env.BROWSER) {
    return (url, options = {}) => {
      const isLocalUrl = /^\/($|[^\/])/.test(url);

      // pass cookie only for itself.
      // We can't know cookies for other sites BTW
      if (isLocalUrl && options.credentials === 'include') {
        const headers = {
          ...options.headers,
          cookie,
        };
        return fetch(url, { ...options, headers });
      }

      return fetch(url, options);
    };
  }

  return fetch;
}

import socketIO from 'socket.io-client';
import { port } from '../config';

function createSocket() {
  if (process.env.BROWSER) {
    // Browser Sync can massup the port (3000 -> 3001) so...
    const parser = document.createElement('a');
    parser.href = window.location.toString();
    parser.port = port;
    const socket = socketIO(parser.href); // eslint-disable-line
    return socket;
  }
  return null;
}

export default function createHelpers(config) {
  const fetchKnowingCookie = createFetchKnowingCookie(config);
  const graphqlRequest = createGraphqlRequest(fetchKnowingCookie);
  const socket = createSocket();

  return {
    fetch: fetchKnowingCookie,
    graphqlRequest,
    history: config.history,
    socket,
  };
}
