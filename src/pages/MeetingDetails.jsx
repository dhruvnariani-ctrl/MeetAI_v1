import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
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
} from '../components/meetingDetails/utils'
import {formatDate} from '../utils/time'
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

import { getMeetingById } from '../data/meetings'
import { getMeetingSettings } from '../data/meetingSettings'

const VALID_TABS = [
  'overview',
  'recording',
  'transcript',
  'actions',
]

function getTabFromSearchParams(
  searchParams,
) {
  const requestedTab =
    searchParams.get('tab')

  if (
    VALID_TABS.includes(
      requestedTab,
    )
  ) {
    return requestedTab
  }

  return 'overview'
}

export default function MeetingDetails() {
  usePageTitle('Meeting Details')

  const navigate = useNavigate()

  const { meetingId } =
    useParams()

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams()

  const [now, setNow] =
    useState(() => new Date())

  const [activeTab, setActiveTab] =
    useState(() =>
      getTabFromSearchParams(
        searchParams,
      ),
    )

  /*
   * The URL is the single source of truth.
   *
   * /meetings/:meetingId
   *
   * No meeting object is read from
   * navigation state.
   */
  const resolvedMeeting =
    getMeetingById(meetingId)

  useEffect(() => {
    const requestedTab =
      getTabFromSearchParams(
        searchParams,
      )

    setActiveTab(requestedTab)
  }, [searchParams])

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 30000)

    return () =>
      clearInterval(timer)
  }, [])

  if (!resolvedMeeting) {
    return (
      <PageShell
        title="Meeting not found"
        subtitle="We couldn't find the meeting you're looking for."
      >
        <Paper
          elevation={0}
          sx={{
            border:
              '1px solid #dce3eb',
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
            The meeting may have been
            removed or is no longer
            available.
          </Typography>

          <Button
            variant="outlined"
            startIcon={
              <ArrowBackOutlinedIcon />
            }
            onClick={() =>
              navigate(-1)
            }
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

  const meetingState =
    getMeetingState(
      resolvedMeeting,
      now,
    )

  /*
   * --------------------------------------------------------------------------
   * MeetAI setting
   * --------------------------------------------------------------------------
   *
   * The saved localStorage value is the source of truth
   * when a user has changed this meeting's setting.
   *
   * Important:
   *
   *   false !== undefined
   *
   * So a saved false will NOT fall back to the original
   * meeting.meetAI.invited value.
   */

  const savedSettings =
    getMeetingSettings()

  const savedMeetingSettings =
    savedSettings?.[
      resolvedMeeting.id
    ]

  const meetAIInvited =
    savedMeetingSettings?.autoJoin !==
    undefined
      ? savedMeetingSettings.autoJoin ===
        true
      : resolvedMeeting?.meetAI
          ?.invited === true

  const participants =
    resolvedMeeting.participants || []

  const attendance =
    getAttendance(
      resolvedMeeting,
      participants,
    )

  const durationMinutes =
    getDurationMinutes(
      resolvedMeeting,
    )

  const timeText =
    formatTimeRange(
      resolvedMeeting.start,
      resolvedMeeting.end,
    )

  const dateText =
    formatDate(
      resolvedMeeting.start,
    )

  const handleTabChange = (
    _,
    value,
  ) => {
    if (
      !VALID_TABS.includes(
        value,
      )
    ) {
      return
    }

    setActiveTab(value)

    setSearchParams(
      (currentParams) => {
        const nextParams =
          new URLSearchParams(
            currentParams,
          )

        nextParams.set(
          'tab',
          value,
        )

        return nextParams
      },
      {
        replace: true,
      },
    )
  }

  return (
    <PageShell
      title=""
      subtitle=""
    >
      <Stack
        spacing={{
          xs: 1.75,
          md: 2.25,
        }}
      >
        {/* ---------------------------------------------------------- */}
        {/* BACK                                                       */}
        {/* ---------------------------------------------------------- */}

        <Button
          startIcon={
            <ArrowBackOutlinedIcon />
          }
          onClick={() =>
            navigate(-1)
          }
          sx={{
            alignSelf:
              'flex-start',
            textTransform:
              'none',
            fontSize: '.78rem',
            color: '#52657d',
            px: 0,
            '&:hover': {
              bgcolor:
                'transparent',
              color:
                'primary.main',
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
            meeting={
              resolvedMeeting
            }
            meetingState={
              meetingState
            }
            meetAIInvited={
              meetAIInvited
            }
            dateText={
              dateText
            }
            timeText={
              timeText
            }
            durationMinutes={
              durationMinutes
            }
          />
        </Box>

        {/* ---------------------------------------------------------- */}
        {/* PARTICIPANTS                                                */}
        {/* ---------------------------------------------------------- */}

        <Box
          data-tour="meeting-participants"
        >
          <ParticipantsPreview
            attendance={
              attendance
            }
            meeting={
              resolvedMeeting
            }
          />
        </Box>

        {/* ---------------------------------------------------------- */}
        {/* TABS                                                        */}
        {/* ---------------------------------------------------------- */}

        <Paper
          elevation={0}
          sx={{
            border:
              '1px solid #dce3eb',
            borderRadius: 2.5,
            bgcolor: '#fff',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={
              handleTabChange
            }
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
                textTransform:
                  'none',
                fontSize: '.78rem',
                fontWeight: 600,
                color: '#66778d',
              },

              '& .Mui-selected': {
                color:
                  'primary.main',
              },

              '& .MuiTabs-indicator':
                {
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
                  sx={{
                    fontSize: 18,
                  }}
                />
              }
              iconPosition="start"
              label="Overview"
            />

            <Tab
              value="recording"
              icon={
                <PlayArrowOutlinedIcon
                  sx={{
                    fontSize: 18,
                  }}
                />
              }
              iconPosition="start"
              label="Recording"
            />

            <Tab
              value="transcript"
              icon={
                <DescriptionOutlinedIcon
                  sx={{
                    fontSize: 18,
                  }}
                />
              }
              iconPosition="start"
              label="Transcript"
            />

            <Tab
              value="actions"
              icon={
                <TaskAltOutlinedIcon
                  sx={{
                    fontSize: 18,
                  }}
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

        {activeTab ===
          'overview' && (
          <Box
            data-tour="meeting-content"
          >
            <OverviewTab
              meeting={
                resolvedMeeting
              }
              meetingState={
                meetingState
              }
              attendance={
                attendance
              }
              durationMinutes={
                durationMinutes
              }
            />
          </Box>
        )}

        {activeTab ===
          'recording' && (
          <RecordingTab
            meeting={
              resolvedMeeting
            }
            meetingState={
              meetingState
            }
          />
        )}

        {activeTab ===
          'transcript' && (
          <TranscriptTab
            meeting={
              resolvedMeeting
            }
            meetingState={
              meetingState
            }
          />
        )}

        {activeTab ===
          'actions' && (
          <ActionItemsTab
            meeting={
              resolvedMeeting
            }
            meetingState={
              meetingState
            }
          />
        )}
      </Stack>
    </PageShell>
  )
}