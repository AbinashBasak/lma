import gql from 'graphql-tag';

export default gql`
  mutation ShareMeetingsMutation($input: ShareMeetingsInput!) {
    shareMeetings(input: $input) {
      Calls
      Result
      Owner
      SharedWith
    }
  }
`;
