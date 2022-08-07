import { createRoot } from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Init from './init';

const client = new ApolloClient({
  uri: 'http://localhost:8000/api/graphql',
  cache: new InMemoryCache(),
});

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <Init />
  </ApolloProvider>,
);
