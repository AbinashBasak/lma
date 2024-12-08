import React, { useEffect, useState } from 'react';
import { useCollection } from '@awsui/collection-hooks';
import '@awsui/global-styles/index.css';

import useCallsContext from '../../contexts/calls';
import useSettingsContext from '../../contexts/settings';
import { KEY_COLUMN_ID, DEFAULT_PREFERENCES, DEFAULT_SORT_COLUMN } from './config';

import mapCallsAttributes from '../common/map-call-attributes';
import useLocalStorage from '../common/local-storage';
import { exportToExcel } from '../common/download-func';
import { CallsCommonHeader } from './calls-table-config';
import { Button } from '../ui/button';
import DynamicPagination from '../ui/dynamic-pagination';
import { Skeleton } from '../ui/skeleton';
import { CallCard } from './CallCard';

const CallList = () => {
  const [callList, setCallList] = useState([]);

  const { settings } = useSettingsContext();
  const { calls, isCallsListLoading, setIsCallsListLoading, setPeriodsToLoad, setSelectedItems, periodsToLoad, getCallDetailsFromCallIds } =
    useCallsContext();

  const [preferences] = useLocalStorage('call-list-preferences', DEFAULT_PREFERENCES);

  const { items, collectionProps, paginationProps } = useCollection(callList, {
    pagination: { pageSize: preferences.pageSize },
    sorting: { defaultState: { sortingColumn: DEFAULT_SORT_COLUMN, isDescending: true } },
    selection: {
      keepSelection: false,
      trackBy: KEY_COLUMN_ID,
    },
  });

  useEffect(() => {
    if (!isCallsListLoading) {
      setCallList(mapCallsAttributes(calls, settings));
    }
  }, [isCallsListLoading, calls]);

  useEffect(() => {
    setSelectedItems(collectionProps.selectedItems);
  }, [collectionProps.selectedItems]);

  return (
    <div>
      <div className="flex flex-col justify-between items-center gap-2 sm:flex-row mb-4">
        <h1 className="text-3xl font-medium m-0">Meetings</h1>
        <Button variant="outline">Upload Transcript or Recording</Button>
      </div>
      <div className="flex justify-end mb-6">
        <CallsCommonHeader
          calls={calls}
          selectedItems={collectionProps.selectedItems}
          loading={isCallsListLoading}
          setIsLoading={setIsCallsListLoading}
          periodsToLoad={periodsToLoad}
          setPeriodsToLoad={setPeriodsToLoad}
          getCallDetailsFromCallIds={getCallDetailsFromCallIds}
          downloadToExcel={() => exportToExcel(callList, 'Meeting-List')}
        />
      </div>

      {isCallsListLoading ? (
        <div className="flex flex-col gap-1">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : null}

      <div className="mb-6">
        {items?.map((item) => (
          <CallCard
            key={item.callId}
            data={item}
            selectedItems={collectionProps.selectedItems}
            onSelectionChange={collectionProps.onSelectionChange}
          />
        ))}
      </div>

      <div className="mt-6">
        <DynamicPagination
          currentPage={paginationProps?.currentPageIndex}
          totalPages={paginationProps?.pagesCount}
          onPageChange={paginationProps?.onChange}
        />
      </div>
    </div>
  );
};

export default CallList;
