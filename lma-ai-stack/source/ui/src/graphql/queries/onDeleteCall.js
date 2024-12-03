import gql from 'graphql-tag';

export default gql`
  subscription Subscription {
    onDeleteCall {
      CallId
      Owner
      SharedWith
    }
  }
`;
