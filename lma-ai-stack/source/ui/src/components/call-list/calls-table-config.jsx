import React, { useMemo } from 'react';
import { CollectionPreferences } from '@awsui/components-react';

import {
  PAGE_SIZE_OPTIONS,
  PERIODS_TO_LOAD_STORAGE_KEY,
  TIME_PERIOD_DROPDOWN_CONFIG,
  TIME_PERIOD_DROPDOWN_ITEMS,
  VISIBLE_CONTENT_OPTIONS,
} from './config';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { shareModal, deleteModal } from '../common/meeting-controls';

/* eslint-disable react/prop-types, react/jsx-props-no-spreading */
export const CallsPreferences = ({
  preferences,
  setPreferences,
  disabled,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  visibleContentOptions = VISIBLE_CONTENT_OPTIONS,
}) => (
  <CollectionPreferences
    title="Preferences"
    confirmLabel="Confirm"
    cancelLabel="Cancel"
    disabled={disabled}
    preferences={preferences}
    onConfirm={({ detail }) => setPreferences(detail)}
    pageSizePreference={{
      title: 'Page size',
      options: pageSizeOptions,
    }}
    wrapLinesPreference={{
      label: 'Wrap lines',
      description: 'Check to see all the text and wrap the lines',
    }}
    visibleContentPreference={{
      title: 'Select visible columns',
      options: visibleContentOptions,
    }}
  />
);

// eslint-disable-next-line no-unused-vars
export const CallsCommonHeader = ({ resourceName = 'Meetings', ...props }) => {
  const onPeriodToLoadChange = (id) => {
    const shardCount = TIME_PERIOD_DROPDOWN_CONFIG[id].count;
    props.setPeriodsToLoad(shardCount);
    localStorage.setItem(PERIODS_TO_LOAD_STORAGE_KEY, JSON.stringify(shardCount));
  };

  const periodText = useMemo(() => TIME_PERIOD_DROPDOWN_ITEMS.filter((i) => i.count === props.periodsToLoad)[0]?.text || '', [props.periodsToLoad]);

  return (
    <div>
      <div className="flex flex-row gap-1">
        <Select onValueChange={(value) => onPeriodToLoadChange(value)} disabled={props.loading}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder={periodText ? periodText : 'Select...'} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {TIME_PERIOD_DROPDOWN_ITEMS.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.text}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" disabled={props.loading} onClick={() => props.setIsLoading(true)}>
          <RefreshCw />
        </Button>
        <Button variant="outline" size="icon" disabled={props.loading} onClick={() => props.downloadToExcel()}>
          <Download />
        </Button>
        {shareModal(props)}
        {deleteModal(props)}
      </div>
    </div>
  );
};
