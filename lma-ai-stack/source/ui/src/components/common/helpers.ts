// eslint-disable-next-line prettier/prettier
export const getCurrentRecipientsDescription = (items: any) =>
  items.length === 1
    ? `The following users have access to "${items[0].callId}". Remove users who no longer need access.`
    : `The following users have access to one or more of the selected meetings. If you share the meetings, all users in this list will have access to ${items.length} meetings. If you remove users, they will lose access to ${items.length} meetings.`;

export const parseSharedWith = (sharedWithString: string) => {
  return (sharedWithString || '')
    .replace(/[[\]]/g, '')
    .split(',')
    .map((email) => email.trim())
    .filter((email) => email);
};
