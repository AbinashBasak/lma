import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useIntegration } from 'context/ProviderIntegrationContext';
import { ReadyState } from 'react-use-websocket';
import { eventBus$, EventPayload } from 'lib/eventBus';

const MeetingNote = () => {
    const { currentCall, sendMessage, readyState } = useIntegration();
    const callId = currentCall?.callId;

    const [note, setNote] = useState('');

    useEffect(() => {
        const subscription = eventBus$.subscribe((event: EventPayload) => {
            if (event.eventType === 'clear') {
                setNote('');
            }
        });

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe();
    }, []);

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
        <div className="w-full h-full flex flex-col px-3 py-2">
            <p className="text-base font-medium text-white mb-2">Note</p>
            <textarea
                value={note}
                onChange={handleNoteChange}
                className="flex-1 resize-none border ring-0 focus-visible:outline-none text-white text-sm bg-slate-800 border-slate-600 p-2"
                rows={8}
                disabled={readyState !== ReadyState.OPEN || !callId}
            />
        </div>
    );
};

export default MeetingNote;
