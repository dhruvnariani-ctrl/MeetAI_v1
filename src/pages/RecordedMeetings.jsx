import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PageShell, {
  EmptyPanel,
} from '../components/PageShell'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined'

import usePageTitle from '../hooks/usePageTitle'

import { getTodaysMeetings } from '../data/Dashboard'

const DATE_FILTERS = [
  'All',
  'Today',
  'This week',
  'This month',
]

const SORT_OPTIONS = [
  'Newest',
  'Oldest',
  'Meeting title',
]

export default function RecordedMeetings() {
  usePageTitle('Recorded Meetings')

  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] =
    useState('All')

  const [sortBy, setSortBy] =
    useState('Newest')

  const [dateAnchorEl, setDateAnchorEl] =
    useState(null)

  const [sortAnchorEl, setSortAnchorEl] =
    useState(null)

  /*
   * Use the existing dashboard data.
   */
  const meetings = useMemo(
    () => getTodaysMeetings(),
    [],
  )

  /*
   * Only meetings with an available recording
   * are shown on this page.
   */
  const recordedMeetings = useMemo(() => {
    let result = meetings.filter(
      (meeting) =>
        meeting.recording?.available === true,
    )

    const searchValue = search
      .trim()
      .toLowerCase()

    if (searchValue) {
      result = result.filter((meeting) => {
        const title =
          meeting.title?.toLowerCase() || ''

        const platform =
          meeting.platform?.toLowerCase() || ''

        const participants =
          meeting.participants
            ?.map(
              (person) =>
                `${person.name || ''} ${
                  person.email || ''
                }`,
            )
            .join(' ')
            .toLowerCase() || ''

        return (
          title.includes(searchValue) ||
          platform.includes(searchValue) ||
          participants.includes(searchValue)
        )
      })
    }

    result = result.filter((meeting) =>
      matchesDateFilter(
        meeting.start,
        dateFilter,
      ),
    )

    if (sortBy === 'Newest') {
      result.sort(
        (a, b) =>
          new Date(b.start) -
          new Date(a.start),
      )
    }

    if (sortBy === 'Oldest') {
      result.sort(
        (a, b) =>
          new Date(a.start) -
          new Date(b.start),
      )
    }

    if (sortBy === 'Meeting title') {
      result.sort((a, b) =>
        a.title.localeCompare(b.title),
      )
    }

    return result
  }, [
    meetings,
    search,
    dateFilter,
    sortBy,
  ])

  const handleDateOpen = (event) => {
    setDateAnchorEl(event.currentTarget)
  }

  const handleDateClose = () => {
    setDateAnchorEl(null)
  }

  const handleDateChange = (value) => {
    setDateFilter(value)
    handleDateClose()
  }

  const handleSortOpen = (event) => {
    setSortAnchorEl(event.currentTarget)
  }

  const handleSortClose = () => {
    setSortAnchorEl(null)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    handleSortClose()
  }

  const handleWatchRecording = (meeting) => {
    navigate(
      `/meetings/${meeting.id}?tab=recording`,
    )
  }

  const handleViewTranscript = (meeting) => {
    navigate(
      `/meetings/${meeting.id}?tab=transcript`,
    )
  }

  return (
    <PageShell
      title="Recorded Meetings"
      subtitle="Find recordings, transcripts and meeting notes from your meetings."
    >
      <Stack spacing={2.5}>

        {/* ====================================================== */}
        {/* SEARCH + FILTERS                                      */}
        {/* ====================================================== */}

        <Paper
          elevation={0}
          sx={{
            border: '1px solid #dce3eb',
            borderRadius: 2.5,
            bgcolor: '#fff',
            p: {
              xs: 1.5,
              sm: 2,
            },
          }}
        >
          <Stack
            data-tour="recorded-filters"
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            spacing={1.25}
          >

            {/* Search */}
            <TextField
              data-tour="recorded-search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search meetings or people"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon
                      sx={{
                        fontSize: 20,
                        color: '#7b8ba1',
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.82rem',
                },
              }}
            />

            {/* Date filter */}
            <Button
              size="small"
              variant="outlined"
              endIcon={
                <KeyboardArrowDownIcon />
              }
              onClick={handleDateOpen}
              sx={{
                minWidth: {
                  xs: '100%',
                  sm: 130,
                },
                justifyContent: 'space-between',
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: 'text.primary',
                borderColor: '#d6dee8',
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: '#aebaca',
                  bgcolor: '#f8fafc',
                },
              }}
            >
              {dateFilter}
            </Button>

            <Menu
              anchorEl={dateAnchorEl}
              open={Boolean(dateAnchorEl)}
              onClose={handleDateClose}
            >
              {DATE_FILTERS.map((item) => (
                <MenuItem
                  key={item}
                  selected={
                    dateFilter === item
                  }
                  onClick={() =>
                    handleDateChange(item)
                  }
                  sx={{
                    minWidth: 160,
                    minHeight: 42,
                    fontSize: '0.85rem',
                  }}
                >
                  {item}
                </MenuItem>
              ))}
            </Menu>

            {/* Sort */}
            <Button
              data-tour="recorded-sort"
              size="small"
              variant="outlined"
              endIcon={
                <KeyboardArrowDownIcon />
              }
              onClick={handleSortOpen}
              sx={{
                minWidth: {
                  xs: '100%',
                  sm: 130,
                },
                justifyContent: 'space-between',
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: 'text.primary',
                borderColor: '#d6dee8',
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: '#aebaca',
                  bgcolor: '#f8fafc',
                },
              }}
            >
              Sort: {sortBy}
            </Button>

            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={handleSortClose}
            >
              {SORT_OPTIONS.map((item) => (
                <MenuItem
                  key={item}
                  selected={sortBy === item}
                  onClick={() =>
                    handleSortChange(item)
                  }
                  sx={{
                    minWidth: 175,
                    minHeight: 42,
                    fontSize: '0.85rem',
                  }}
                >
                  {item}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Paper>

        {/* ====================================================== */}
        {/* COUNT                                                  */}
        {/* ====================================================== */}

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

        {/* ====================================================== */}
        {/* MEETING LIST                                           */}
        {/* ====================================================== */}

        <Box data-tour="recorded-meeting-list">
          {recordedMeetings.length === 0 ? (
            <EmptyPanel title="No recorded meetings">
              {search ||
              dateFilter !== 'All'
                ? 'No recorded meetings match your search or filters.'
                : 'Meetings that MeetAI joins and records will show up here.'}
            </EmptyPanel>
          ) : (
            <Stack spacing={1.5}>
              {recordedMeetings.map(
                (meeting) => (
                  <RecordedMeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onWatchRecording={() =>
                      handleWatchRecording(
                        meeting,
                      )
                    }
                    onViewTranscript={() =>
                      handleViewTranscript(
                        meeting,
                      )
                    }
                  />
                ),
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </PageShell>
  )
}

/* ====================================================== */
/* RECORDED MEETING CARD                                  */
/* ====================================================== */

function RecordedMeetingCard({
  meeting,
  onWatchRecording,
  onViewTranscript,
}) {
  const start = new Date(meeting.start)
  const end = new Date(meeting.end)

  const dateText =
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(start)

  const timeText = `${formatTime(
    start,
  )} – ${formatTime(end)}`

  const participantCount =
    meeting.participants?.length || 0

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #dce3eb',
        borderRadius: 2.5,
        bgcolor: '#fff',
        px: {
          xs: 1.75,
          sm: 2.5,
        },
        py: {
          xs: 1.75,
          sm: 2,
        },
        transition:
          'border-color 160ms ease, box-shadow 160ms ease',

        '&:hover': {
          borderColor: '#bdc9d8',
          boxShadow:
            '0 4px 14px rgba(15,23,42,0.06)',
        },
      }}
    >
      <Stack spacing={1.75}>

        {/* Meeting heading */}
        <Box
          sx={{
            display: 'flex',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.25,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                bgcolor: '#f5f7fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: {
                    xs: '0.92rem',
                    sm: '0.98rem',
                  },
                  fontWeight: 650,
                  lineHeight: 1.4,
                  color: '#172b46',
                }}
              >
                {meeting.title}
              </Typography>

              <Typography
                sx={{
                  mt: 0.35,
                  fontSize: '0.72rem',
                  color: '#66778d',
                }}
              >
                {meeting.platform} · {dateText},{' '}
                {timeText}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              px: 1.1,
              py: 0.5,
              borderRadius: '20px',
              bgcolor: '#eaf7ef',
              color: '#287a4d',
              fontSize: '0.68rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Recording available
          </Box>
        </Box>

        {/* Participants and duration */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            flexWrap: 'wrap',
            rowGap: 0.75,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.72rem',
              color: '#52657d',
            }}
          >
            {participantCount}{' '}
            {participantCount === 1
              ? 'participant'
              : 'participants'}
          </Typography>

          {meeting.recording?.duration && (
            <Typography
              sx={{
                fontSize: '0.72rem',
                color: '#52657d',
              }}
            >
              {meeting.recording.duration}
            </Typography>
          )}
        </Stack>

        {/* ====================================================== */}
        {/* AVAILABLE CONTENT                                     */}
        {/* ====================================================== */}

        <Stack
          data-tour="recorded-actions"
          direction="row"
          spacing={1}
          sx={{
            flexWrap: 'wrap',
            rowGap: 0.75,
          }}
        >
          <AvailabilityBadge
            icon={<PlayArrowOutlinedIcon />}
            label="Recording available"
            available={
              meeting.recording?.available
            }
          />

          <AvailabilityBadge
            icon={<DescriptionOutlinedIcon />}
            label="Transcript available"
            available={
              meeting.transcript?.available
            }
          />

          <AvailabilityBadge
            icon={<NotesOutlinedIcon />}
            label="Meeting notes available"
            available={
              meeting.meetingNotes?.available
            }
          />
        </Stack>

        {/* ====================================================== */}
        {/* ACTION BUTTONS                                        */}
        {/* ====================================================== */}

        <Box
          data-tour="recorded-content-actions"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
            pt: 0.25,
          }}
        >
          {/* Watch recording */}
          <Button
            size="small"
            variant="contained"
            startIcon={
              <PlayArrowOutlinedIcon />
            }
            disabled={
              !meeting.recording?.available
            }
            onClick={onWatchRecording}
            sx={{
              textTransform: 'none',
              fontSize: '0.76rem',
              fontWeight: 600,
              minHeight: 34,
              px: 1.5,
            }}
          >
            Watch recording
          </Button>

          {/* View transcript */}
          <Button
            size="small"
            variant="outlined"
            startIcon={
              <DescriptionOutlinedIcon />
            }
            disabled={
              !meeting.transcript?.available
            }
            onClick={onViewTranscript}
            sx={{
              textTransform: 'none',
              fontSize: '0.76rem',
              fontWeight: 500,
              minHeight: 34,
              px: 1.5,
              borderColor: '#d1dae5',
            }}
          >
            View transcript
          </Button>

          {/* Meeting notes */}
          <Button
            size="small"
            variant="outlined"
            startIcon={
              <NotesOutlinedIcon />
            }
            disabled={
              !meeting.meetingNotes?.available
            }
            sx={{
              textTransform: 'none',
              fontSize: '0.76rem',
              fontWeight: 500,
              minHeight: 34,
              px: 1.5,
              borderColor: '#d1dae5',
            }}
          >
            Meeting notes
          </Button>
        </Box>
      </Stack>
    </Paper>
  )
}

/* ====================================================== */
/* AVAILABILITY BADGE                                     */
/* ====================================================== */

function AvailabilityBadge({
  icon,
  label,
  available,
}) {
  const displayLabel = available
    ? label
    : label.replace(
        ' available',
        ' unavailable',
      )

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: '16px',
        bgcolor: available
          ? '#f1f8f4'
          : '#f5f6f8',
        color: available
          ? '#287a4d'
          : '#8793a3',
        fontSize: '0.67rem',
        fontWeight: 500,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',

          '& svg': {
            fontSize: 14,
          },
        }}
      >
        {icon}
      </Box>

      {displayLabel}
    </Box>
  )
}

/* ====================================================== */
/* DATE FILTERING                                         */
/* ====================================================== */

function matchesDateFilter(
  value,
  filter,
) {
  if (filter === 'All') {
    return true
  }

  const date = new Date(value)
  const now = new Date()

  if (filter === 'Today') {
    return isSameDay(date, now)
  }

  if (filter === 'This week') {
    return isSameWeek(date, now)
  }

  if (filter === 'This month') {
    return (
      date.getFullYear() ===
        now.getFullYear() &&
      date.getMonth() === now.getMonth()
    )
  }

  return true
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSameWeek(date, now) {
  const start = new Date(now)

  start.setHours(0, 0, 0, 0)

  const day = start.getDay()

  const diff =
    day === 0 ? -6 : 1 - day

  start.setDate(
    start.getDate() + diff,
  )

  const end = new Date(start)

  end.setDate(
    end.getDate() + 7,
  )

  return date >= start && date < end
}

/* ====================================================== */
/* TIME FORMAT                                            */
/* ====================================================== */

function formatTime(value) {
  return new Intl.DateTimeFormat(
    'en-US',
    {
      hour: 'numeric',
      minute: '2-digit',
    },
  ).format(value)
}