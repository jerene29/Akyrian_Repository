import { InMemoryCache, ApolloClient, HttpLink, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: Cypress.env('REACT_CYPRESS_API_URL'),
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  return { headers };
});

const middlewareLink = new ApolloLink((operation, forward) => {
  return forward(operation);
});

// const middlewareLink = new ApolloLink((operation, forward) => {
//   return forward(operation).map(response => {
//     const context = operation.getContext();
//     const { response: { headers } } = context;
//
//     if (headers) {
//       // const token = headers.get("x-refresh-token");
//       //
//       // if (token) {
//       //   localStorage.setItem("token", token);
//       // }
//     }
//
//     return response;
//   });
// });

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      console.log(message);
    });
  }

  if (networkError) {
    console.log(networkError);
  }
});

// function run from the first, httplink must be the last
const client = new ApolloClient({
  link: ApolloLink.from([middlewareLink, authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  credentials: 'include',
});

export default client;
