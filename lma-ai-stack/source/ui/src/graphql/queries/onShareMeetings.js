import gql from 'graphql-tag';

export default gql`
  subscription Subscription {
    onShareMeetings {
      Calls
      Result
      Owner
      SharedWith
    }
  }
`;
