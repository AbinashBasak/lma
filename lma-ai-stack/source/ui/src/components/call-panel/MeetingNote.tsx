import React, { useCallback, useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { NotebookIcon } from 'lucide-react';
import useAppContext from 'contexts/app';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import useSettingsContext from 'contexts/settings';
import { debounce } from 'lodash';
import { API } from 'aws-amplify';
import getCallNote from '../../graphql/queries/getCallNote';

interface IMeetingNote {
  callId: string;
}

const MeetingNote = ({ callId }: IMeetingNote) => {
  const [note, setNote] = useState('');

  const { currentSession } = useAppContext() as any;
  const { settings } = useSettingsContext() as any;
  const JWT_TOKEN = currentSession.getAccessToken().getJwtToken();

  const fetchNote = async () => {
    try {
      const res = (await API.graphql({ query: getCallNote as any, variables: { callId } })) as any;
      if (res?.data?.getCallNote?.note) {
        setNote(res.data.getCallNote.note);
      }
    } catch (error) {
      console.log('');
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  // const { sendMessage, readyState } = useWebSocket('http://127.0.0.1:8080/api/v1/ws', {
  const { sendMessage, readyState } = useWebSocket(settings.WSEndpoint, {
    queryParams: {
      authorization: `Bearer ${JWT_TOKEN}`,
      id_token: `${currentSession.idToken.jwtToken}`,
      refresh_token: `${currentSession.refreshToken.token}`,
    },
    shouldReconnect: () => true,
  });

  const updateNote = useCallback(
    debounce((value) => {
      sendMessage(
        JSON.stringify({
          callEvent: 'NOTE',
          callId,
          note: value,
        }),
      );
    }, 600),
    [callId, sendMessage],
  );

  const handleNoteChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setNote(event.target.value);
    updateNote(event.target.value);
  };

  return (
    <div className="w-full border border-slate-200 p-3 bg-white rounded-lg cursor-pointer">
      <div>
        <textarea
          value={note}
          onChange={handleNoteChange}
          className="w-full resize-none border-none ring-0 focus-visible:outline-none text-black text-sm"
          rows={8}
          disabled={readyState !== ReadyState.OPEN}
        />
      </div>
    </div>
  );
};

export default MeetingNote;
