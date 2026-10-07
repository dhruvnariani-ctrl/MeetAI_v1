import { useEffect, useMemo, useState } from 'react'
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import PageShell from '../components/PageShell'

import MeetingHeader from '../components/meetingDetails/MeetingHeader'
import OverviewTab from '../components/meetingDetails/OverviewTab'
import ParticipantsPreview from '../components/meetingDetails/ParticipantsPreview'
import RecordingTab from '../components/meetingDetails/RecordingTab'
import TranscriptTab from '../components/meetingDetails/TranscriptTab'
import ActionItemsTab from '../components/meetingDetails/ActionItemsTab'

import {
  getMeetingState,
  getAttendance,
  getDurationMinutes,
  formatTimeRange,
  formatDate,
  getMeetingIdFromPath,
} from '../components/meetingDetails/utils'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'

import usePageTitle from '../hooks/usePageTitle'

import { getTodaysMeetings } from '../data/Dashboard'

const VALID_TABS = [
  'overview',
  'recording',
  'transcript',
  'actions',
]

function getTabFromSearchParams(searchParams) {
  const requestedTab = searchParams.get('tab')

  if (VALID_TABS.includes(requestedTab)) {
    return requestedTab
  }

  return 'overview'
}

export default function MeetingDetails() {
  usePageTitle('Meeting Details')

  const navigate = useNavigate()
  const location = useLocation()

  const [searchParams, setSearchParams] =
    useSearchParams()

  const [now, setNow] = useState(
    () => new Date(),
  )

  const [activeTab, setActiveTab] = useState(
    () => getTabFromSearchParams(searchParams),
  )

  const meeting = location.state?.meeting

  const meetingId =
    location.state?.meetingId ||
    getMeetingIdFromPath(location.pathname)

  const resolvedMeeting = useMemo(() => {
    if (meeting) {
      return meeting
    }

    if (!meetingId) {
      return null
    }

    const meetings = getTodaysMeetings()

    return meetings.find(
      (item) =>
        String(item.id) === String(meetingId),
    )
  }, [meeting, meetingId])

  /*
   * Keep the active tab synchronized with the
   * ?tab= query parameter.
   *
   * This is what allows links such as:
   *
   * /meetings/123?tab=recording
   * /meetings/123?tab=transcript
   * /meetings/123?tab=actions
   */
  useEffect(() => {
    const requestedTab =
      getTabFromSearchParams(searchParams)

    setActiveTab(requestedTab)
  }, [searchParams])

  /*
   * Keep the current time updated so meeting status
   * can change while the page is open.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  /*
   * Change the active tab and keep the URL in sync.
   */
  const handleTabChange = (_, value) => {
    if (!VALID_TABS.includes(value)) {
      return
    }

    setActiveTab(value)

    setSearchParams(
      (currentParams) => {
        const nextParams =
          new URLSearchParams(currentParams)

        nextParams.set('tab', value)

        return nextParams
      },
      {
        replace: true,
      },
    )
  }

  if (!resolvedMeeting) {
    return (
      <PageShell
        title="Meeting not found"
        subtitle="We couldn't find the meeting you're looking for."
      >
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #dce3eb',
            borderRadius: 3,
            p: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: '.9rem',
              color: 'text.secondary',
              mb: 2,
            }}
          >
            The meeting may have been removed or is
            no longer available.
          </Typography>

          <Button
            variant="outlined"
            startIcon={
              <ArrowBackOutlinedIcon />
            }
            onClick={() => navigate(-1)}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            Go back
          </Button>
        </Paper>
      </PageShell>
    )
  }

  const meetingState = getMeetingState(
    resolvedMeeting,
    now,
  )

  const participants =
    resolvedMeeting.participants || []

  const attendance = getAttendance(
    resolvedMeeting,
    participants,
  )

  const durationMinutes =
    getDurationMinutes(resolvedMeeting)

  const timeText = formatTimeRange(
    resolvedMeeting.start,
    resolvedMeeting.end,
  )

  const dateText = formatDate(
    resolvedMeeting.start,
  )

  return (
    <PageShell
      title=""
      subtitle=""
    >
      <Stack spacing={{ xs: 1.75, md: 2.25 }}>

        {/* ---------------------------------------------------------- */}
        {/* BACK                                                       */}
        {/* ---------------------------------------------------------- */}

        <Button
          startIcon={
            <ArrowBackOutlinedIcon />
          }
          onClick={() => navigate(-1)}
          sx={{
            alignSelf: 'flex-start',
            textTransform: 'none',
            fontSize: '.78rem',
            color: '#52657d',
            px: 0,
            '&:hover': {
              bgcolor: 'transparent',
              color: 'primary.main',
            },
          }}
        >
          Back to meetings
        </Button>

        {/* ---------------------------------------------------------- */}
        {/* HEADER                                                      */}
        {/* ---------------------------------------------------------- */}

        <Box data-tour="meeting-header">
          <MeetingHeader
            meeting={resolvedMeeting}
            meetingState={meetingState}
            dateText={dateText}
            timeText={timeText}
            durationMinutes={durationMinutes}
          />
        </Box>

        {/* ---------------------------------------------------------- */}
        {/* PARTICIPANTS - OUTSIDE TABS                                */}
        {/* ---------------------------------------------------------- */}

        <Box data-tour="meeting-participants">
          <ParticipantsPreview
            attendance={attendance}
            meeting={resolvedMeeting}
          />
        </Box>

        {/* ---------------------------------------------------------- */}
        {/* TABS                                                        */}
        {/* ---------------------------------------------------------- */}

        <Paper
          elevation={0}
          sx={{
            border: '1px solid #dce3eb',
            borderRadius: 2.5,
            bgcolor: '#fff',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons={false}
            sx={{
              minHeight: 54,
              px: {
                xs: 0.5,
                sm: 1,
              },

              '& .MuiTab-root': {
                minHeight: 54,
                minWidth: {
                  xs: 105,
                  sm: 125,
                },
                textTransform: 'none',
                fontSize: '.78rem',
                fontWeight: 600,
                color: '#66778d',
              },

              '& .Mui-selected': {
                color: 'primary.main',
              },

              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius:
                  '3px 3px 0 0',
              },
            }}
          >
            <Tab
              value="overview"
              icon={
                <CalendarMonthOutlinedIcon
                  sx={{ fontSize: 18 }}
                />
              }
              iconPosition="start"
              label="Overview"
            />

            <Tab
              value="recording"
              icon={
                <PlayArrowOutlinedIcon
                  sx={{ fontSize: 18 }}
                />
              }
              iconPosition="start"
              label="Recording"
            />

            <Tab
              value="transcript"
              icon={
                <DescriptionOutlinedIcon
                  sx={{ fontSize: 18 }}
                />
              }
              iconPosition="start"
              label="Transcript"
            />

            <Tab
              value="actions"
              icon={
                <TaskAltOutlinedIcon
                  sx={{ fontSize: 18 }}
                />
              }
              iconPosition="start"
              label="Action items"
            />
          </Tabs>
        </Paper>

        {/* ---------------------------------------------------------- */}
        {/* TAB CONTENT                                                 */}
        {/* ---------------------------------------------------------- */}

        {activeTab === 'overview' && (
          <Box data-tour="meeting-content">
            <OverviewTab
              meeting={resolvedMeeting}
              meetingState={meetingState}
              attendance={attendance}
              durationMinutes={
                durationMinutes
              }
            />
          </Box>
        )}

        {activeTab === 'recording' && (
          <RecordingTab
            meeting={resolvedMeeting}
            meetingState={meetingState}
          />
        )}

        {activeTab === 'transcript' && (
          <TranscriptTab
            meeting={resolvedMeeting}
            meetingState={meetingState}
          />
        )}

        {activeTab === 'actions' && (
          <ActionItemsTab
            meeting={resolvedMeeting}
            meetingState={meetingState}
          />
        )}
      </Stack>
    </PageShell>
  )
}