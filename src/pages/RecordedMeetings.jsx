import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PageShell, { EmptyPanel } from '../components/PageShell'
import RecordedFilters from '../components/recorded/RecordedFilters'
import RecordedMeetingCard from '../components/recorded/RecordedMeetingCard'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import usePageTitle from '../hooks/usePageTitle'

import { getAllMeetings } from '../data/meetings'
import {
  getRecordedMeetings,
  RECORDED_SORT_OPTIONS,
} from '../data/recorded'
import { DATE_FILTERS } from '../utils/dateFilters'

export default function RecordedMeetings() {
  usePageTitle('Recorded Meetings')

  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')

  const meetings = useMemo(
    () => getAllMeetings(),
    [],
  )

  const recordedMeetings = useMemo(
    () =>
      getRecordedMeetings(
        meetings,
        search,
        dateFilter,
        sortBy,
      ),
    [meetings, search, dateFilter, sortBy],
  )

  return (
    <PageShell
      title="Recorded Meetings"
      subtitle="Find recordings, transcripts and meeting notes from your meetings."
    >
      <Stack spacing={2.5}>
        <RecordedFilters
          search={search}
          onSearchChange={setSearch}
          dateFilters={DATE_FILTERS}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          sortOptions={RECORDED_SORT_OPTIONS}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#24364d',
            }}
          >
            {recordedMeetings.length}{' '}
            {recordedMeetings.length === 1
              ? 'recorded meeting'
              : 'recorded meetings'}
          </Typography>
        </Box>

        <Box data-tour="recorded-meeting-list">
          {recordedMeetings.length === 0 ? (
            <EmptyPanel title="No recorded meetings">
              {search || dateFilter !== 'All'
                ? 'No recorded meetings match your search or filters.'
                : 'Meetings that MeetAI joins and records will show up here.'}
            </EmptyPanel>
          ) : (
            <Stack spacing={1.5}>
              {recordedMeetings.map((meeting) => (
                <RecordedMeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onWatchRecording={() =>
                    navigate(
                      `/meetings/${meeting.id}?tab=recording`,
                    )
                  }
                  onViewTranscript={() =>
                    navigate(
                      `/meetings/${meeting.id}?tab=transcript`,
                    )
                  }
                />
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </PageShell>
  )
}