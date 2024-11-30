import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import useCallsContext from '../../contexts/calls';
import useSettingsContext from '../../contexts/settings';

import mapCallsAttributes from '../common/map-call-attributes';
import { IN_PROGRESS_STATUS } from '../common/get-recording-status';

import '@awsui/global-styles/index.css';

import CallPanel from '../call-panel';
import { Skeleton } from 'components/ui/skeleton';

const CallDetails = () => {
  const { callId } = useParams();
  const { calls, callTranscriptPerCallId, getCallDetailsFromCallIds, sendGetTranscriptSegmentsRequest, setToolsOpen, setLiveTranscriptCallId } =
    useCallsContext();
  const { settings } = useSettingsContext();

  const [call, setCall] = useState(null);

  const sendInitCallRequests = async () => {
    const response = await getCallDetailsFromCallIds([callId]);

    const callsMap = mapCallsAttributes(response, settings);
    const callDetails = callsMap[0];
    if (callDetails) {
      setCall(callDetails);
      if (!callTranscriptPerCallId[callId]) {
        await sendGetTranscriptSegmentsRequest(callId);
      }
      if (callDetails?.recordingStatusLabel === IN_PROGRESS_STATUS) {
        setLiveTranscriptCallId(callId);
      }
    }
  };

  useEffect(() => {
    if (!callId) {
      return () => {};
    }
    sendInitCallRequests();
    return () => {
      setLiveTranscriptCallId(null);
    };
  }, [callId]);

  useEffect(() => {
    if (!callId || !call || !calls?.length) {
      return;
    }
    const callsFiltered = calls.filter((c) => c.CallId === callId);
    if (callsFiltered && callsFiltered?.length) {
      const callsMap = mapCallsAttributes([callsFiltered[0]], settings);
      const callDetails = callsMap[0];
      if (callDetails?.updatedAt && call.updatedAt < callDetails.updatedAt) {
        setCall(callDetails);
      }
    }
  }, [calls, callId]);

  if (!call) {
    return <Skeleton className="h-16 w-full" />;
  }
  return <CallPanel item={call} setToolsOpen={setToolsOpen} callTranscriptPerCallId={callTranscriptPerCallId} />;
};

export default CallDetails;
