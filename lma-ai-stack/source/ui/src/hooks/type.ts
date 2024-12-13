export interface Call {
  CallId: string;
  AgentId: string;
  Owner: string;
  SharedWith?: string | null;
  CallCategories?: string | null;
  IssuesDetected?: string | null;
  CallSummaryText?: string | null;
  CreatedAt: string; // ISO date string
  CustomerPhoneNumber: string;
  Status: string;
  SystemPhoneNumber: string;
  UpdatedAt: string; // ISO date string
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
