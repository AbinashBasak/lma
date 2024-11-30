import gql from 'graphql-tag';

export default gql`
  query Query($callId: ID!) {
    getCallNote(CallId: $callId) {
      PK
      note
    }
  }
`;
