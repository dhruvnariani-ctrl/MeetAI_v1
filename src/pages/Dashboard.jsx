import { useMemo, useState } from 'react'
import { Link as RouterLink, useOutletContext } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined'

import UpNextCard from '../components/dashboard/UpNextCard'
import ScheduleCard from '../components/dashboard/ScheduleCard'
import NextMeetingCard from '../components/dashboard/NextMeetingCard'
import ActionItemsCard from '../components/dashboard/ActionItemsCard'
import ActionItemCountCard from '../components/dashboard/ActionItemCountCard'

import { getTodaysMeetings } from '../data/Dashboard'
import { gradientButtonSx, outlinedPillSx } from '../ButtonStyles'
import useNow from '../hooks/Usenow'
import usePageTitle from '../hooks/usePageTitle'

const dateFmt = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/**
 * Extract all action items from today's meetings.
 *
 * Meeting data is the single source of truth.
 */
const getActionItemsFromMeetings = (meetings) => {
  return meetings.flatMap((meeting) => {
    const actionItems = Array.isArray(meeting.actionItems)
      ? meeting.actionItems
      : []

    return actionItems.map((item, index) => ({
      id: item.id ?? `${meeting.id}-task-${index}`,
      title:
        item.title ??
        item.task ??
        item.description ??
        'Untitled task',

      meeting:
        item.meeting ??
        item.meetingTitle ??
        meeting.title,

      due:
        item.due ??
        item.dueDate ??
        null,

      owner:
        item.owner ??
        item.assignee ??
        item.assignedTo ??
        'Unassigned',

      priority:
        item.priority ??
        'Medium',

      status:
        item.status ??
        'Pending',

      meetingId: meeting.id,
    }))
  })
}

export default function Dashboard() {
  usePageTitle('Dashboard')

  const {
    openCreate,
    openInstant,
    currentUser,
  } = useOutletContext()

  const now = useNow()

  /*
   * Today's meetings are the primary dashboard data source.
   */
  const meetings = useMemo(
    () => getTodaysMeetings(),
    [],
  )

  /*
   * Extract action items from the same meeting data.
   * Both the count card and list use this exact same array.
   */
  const actionItems = useMemo(
    () => getActionItemsFromMeetings(meetings),
    [meetings],
  )

  const nextMeeting = meetings.find(
    (meeting) => meeting.start > now,
  )

  /*
   * Per-meeting MeetAI settings.
   *
   * {
   *   [meetingId]: {
   *     autoJoin: boolean,
   *     recordVideo: boolean,
   *   }
   * }
   */
  const [meetingSettings, setMeetingSettings] = useState({})

  const updateMeetingSettings = (id, patch) => {
    setMeetingSettings((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...patch,
      },
    }))
  }

  const hour = now.getHours()

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
        ? 'Good afternoon'
        : 'Good evening'

  const firstName =
    currentUser?.name?.split(' ')[0] ?? 'there'

  return (
    <>
      {/* Header */}
      <Box
        data-tour="dashboard-welcome"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            component="p"
            sx={{
              fontSize: '0.8125rem',
              color: 'text.secondary',
            }}
          >
            <time dateTime={now.toLocaleDateString('en-CA')}>
              {dateFmt.format(now)}
            </time>
          </Typography>

          <Typography
            variant="h1"
            component="h1"
            sx={{
              mt: 0.25,
            }}
          >
            {greeting}, {firstName}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Button
            data-tour="dashboard-new-meeting"
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            onClick={openCreate}
            sx={gradientButtonSx(36)}
          >
            Create new meeting
          </Button>
          <Button
            variant="outlined"
            startIcon={<VideocamOutlinedIcon />}
            onClick={openInstant}
            sx={outlinedPillSx(36)}
          >
            Add MeetAI to a Meeting
          </Button>
        </Box>
      </Box>

      {/* Dashboard content */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: '2fr 1fr',
          },
        }}
      >
        {/* Left column */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            alignContent: 'start',
            minWidth: 0,
          }}
        >
          <UpNextCard meeting={nextMeeting} />

          <Box data-tour="dashboard-todays-meetings">
            <ScheduleCard
              meetings={meetings}
              now={now}
              nextId={nextMeeting?.id}
              settings={meetingSettings}
              onSettingsChange={updateMeetingSettings}
            />
          </Box>
        </Box>

        {/* Right column */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateRows: {
              md: 'auto auto 1fr',
            },
            minWidth: 0,
          }}
        >
          {/* Action item count uses the same extracted actionItems array */}
          <ActionItemCountCard
            count={actionItems.length}
          />

          <Box data-tour="dashboard-next-meeting">
            <NextMeetingCard
              meeting={nextMeeting}
              now={now}
            />
          </Box>

          {/* Action item list uses the same extracted actionItems array */}
          <ActionItemsCard
            items={actionItems}
          />
        </Box>
      </Box>
    </>
  )
}