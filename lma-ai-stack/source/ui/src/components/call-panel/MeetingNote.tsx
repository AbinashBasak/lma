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
      const res = await API.graphql({ query: getCallNote as any, variables: { callId } });
      console.clear();
      console.log(res);
    } catch (error) {
      console.log(error);
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
    // onOpen: (event) => {
    //   console.log(`
    //     DEBUG - [${new Date().toISOString()}]: Websocket onOpen Event: ${JSON.stringify(event)}
    //   `);
    // },
    // onClose: (event) => {
    //   console.log(`
    //     DEBUG - [${new Date().toISOString()}]: Websocket onClose Event: ${JSON.stringify(event)}
    //   `);
    // },
    // onError: (event) => {
    //   console.log(`
    //     DEBUG - [${new Date().toISOString()}]: Websocket onError Event: ${JSON.stringify(event)}
    //   `);
    // },
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
    <Collapsible className="w-full border border-slate-200 p-3 bg-white rounded-lg cursor-pointer">
      <CollapsibleTrigger asChild>
        <div className="flex flex-row gap-2 items-center select-none">
          <div className="h-6 w-6 rounded-md bg-slate-100 flex justify-center items-center">
            <NotebookIcon size={14} className="text-slate-600" />
          </div>
          <p className="text-sm text-slate-600 leading-none">Note</p>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent forceMount className="data-[state=closed]:hidden">
        <div className="border-t mt-3 pt-2">
          <textarea
            value={note}
            onChange={handleNoteChange}
            className="w-full resize-none border-none ring-0 focus-visible:outline-none text-black text-sm"
            rows={8}
            disabled={readyState !== ReadyState.OPEN}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MeetingNote;
