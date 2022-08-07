import { gql, useMutation, useQuery } from '@apollo/client';
import App from './App';

const GET_STATE = gql`
  query GET_STATE {
    state
  }
`;

const DEFAULT = { devtoolsPosition: 'right', elements: [] };

function Init() {
  const { data } = useQuery(GET_STATE, { fetchPolicy: 'no-cache' });

  if (!data) {
    return <div>Initialising...</div>;
  }

  let initialState;

  try {
    initialState = JSON.parse(data.state);
  } catch (e) {
    initialState = DEFAULT;
  }

  return <App initialState={initialState} />;
}

export default Init;
