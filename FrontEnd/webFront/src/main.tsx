import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider,createHttpLink} from '@apollo/client';
import {BrowserRouter} from "react-router-dom";
import AuthProvider from "../context/AuthContext.tsx";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/query',
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : "",
        }
    }
});
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
});




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ApolloProvider client={client}>
          <BrowserRouter>
              <AuthProvider>
                  <App />
              </AuthProvider>
          </BrowserRouter>
      </ApolloProvider>,
  </React.StrictMode>,
)
