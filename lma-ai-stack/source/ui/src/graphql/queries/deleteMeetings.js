import gql from 'graphql-tag';

export default gql`
  mutation DeleteMeetingsMutation($input: DeleteMeetingsInput!) {
    deleteMeetings(input: $input) {
      Result
    }
  }
`;
