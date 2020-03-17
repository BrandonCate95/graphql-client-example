import React from 'react';
import ReactDOM from 'react-dom';
// import './index.scss';
import App from './App';
// import * as serviceWorker from './serviceWorker';

import { BrowserRouter as Router } from "react-router-dom";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { ApolloProvider } from "react-apollo";
import gql from "graphql-tag";

const wsClient = new SubscriptionClient('ws://gruesome-vampire-41677.herokuapp.com/graphql',{
  reconnect: true,
  connectionParams: {
      authToken: true,
  }
})

const wsLink = new WebSocketLink(wsClient)

const startTime = new Date().getMilliseconds()
console.log(startTime)
// ws and http mount times seem similar, but ws query times faster by factor of 2
const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
});

client
  .query({
    query: gql`
    {
      Person{
        name
      }
    }
    `
  })
  .then(result => { console.log(result); console.log(new Date().getMilliseconds() - startTime) });

const WithProvider = () => (
    <ApolloProvider client={client}>
        <Router>
            <App />
        </Router>
    </ApolloProvider>
)

ReactDOM.hydrate(<WithProvider />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
