import gql from 'graphql-tag';

export default gql`
  subscription Subscription {
    onUnshareCall {
      CallId
      SharedWith
    }
  }
`;
