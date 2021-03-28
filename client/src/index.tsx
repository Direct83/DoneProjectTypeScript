import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './redux/store';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const link = createHttpLink({
  uri: '/graphql',
  credentials: 'same-origin'
})

const client = new ApolloClient({
  uri: 'http://localhost:3100/graphql',
  cache: new InMemoryCache(),
  link
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
