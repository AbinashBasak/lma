import { useContext, createContext } from 'react';

// Define the structure of a Call
export interface ICall {
  CallId: string;
  AgentId: string;
  Owner: string;
  SharedWith?: string | null;
  CallCategories?: string | null;
  IssuesDetected?: string | null;
  CallSummaryText?: string | null;
  CreatedAt: string;
  CustomerPhoneNumber: string;
  Status: string;
  SystemPhoneNumber: string;
  UpdatedAt: string;
  RecordingUrl?: string | null;
  PcaUrl?: string | null;
  TotalConversationDurationMillis?: number | null;
  UserName?: string | null;
  MeetingTopic?: string | null;
  Sentiment?: {
    OverallSentiment?: {
      AGENT?: string | null;
      CALLER?: string | null;
    };
    SentimentByPeriod?: {
      QUARTER?: {
        AGENT?: string | null;
        CALLER?: string | null;
      };
    };
  } | null;
  ListPK: string;
  ListSK: string;
}

// Define the context value structure
export interface CallsContextValue {
  calls: ICall[];
  callTranscriptPerCallId: Record<string, string>;
  getCallDetailsFromCallIds: (callIds: string[]) => void;
  isCallsListLoading: boolean;
  selectedItems: any[]; // Adjust type if you know the structure of the items
  sendGetTranscriptSegmentsRequest: (callId: string) => void;
  setIsCallsListLoading: (isLoading: boolean) => void;
  setLiveTranscriptCallId: (callId: string) => void;
  setPeriodsToLoad: (periods: number[]) => void;
  setToolsOpen: (isOpen: boolean) => void;
  setSelectedItems: (items: any[]) => void; // Adjust type if you know the structure
  periodsToLoad: number[];
  toolsOpen: boolean;
}

// Create the context
export const CallsContext = createContext<CallsContextValue | null>(null);

// Custom hook to access the CallsContext
const useCallsContext = (): CallsContextValue => useContext(CallsContext as any);

export default useCallsContext;
