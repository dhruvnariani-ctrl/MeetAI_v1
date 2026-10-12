import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import Box from '@mui/material/Box'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import UpNextCard from '../components/dashboard/UpNextCard'
import ScheduleCard from '../components/dashboard/ScheduleCard'
import NextMeetingCard from '../components/dashboard/NextMeetingCard'
import ActionItemsCard from '../components/dashboard/ActionItemsCard'
import ActionItemCountCard from '../components/dashboard/ActionItemCountCard'

import { getTodaysMeetings } from '../data/meetings'

import {
  createMeetingSettings,
  saveMeetingSettings,
} from '../data/meetingSettings'

import useNow from '../hooks/Usenow'
import usePageTitle from '../hooks/usePageTitle'
import useCurrentUser from '../hooks/useCurrentUser'

import {
  filterUserMeetings,
} from '../utils/meetingAccess'

/* Meeting data is the single source of truth for action items. */
const getActionItemsFromMeetings = (meetings) =>
  meetings.flatMap((meeting) => {
    const actionItems = Array.isArray(
      meeting.actionItems,
    )
      ? meeting.actionItems
      : []

    return actionItems.map((item, index) => ({
      id:
        item.id ??
        `${meeting.id}-task-${index}`,

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

export default function Dashboard() {
  usePageTitle('Dashboard')

  const {
    openCreate,
    openInstant,
  } = useOutletContext()

  const currentUser = useCurrentUser()

  const now = useNow()

  /* Today's meetings are the primary Dashboard data source. */
  const meetings = useMemo(
    () =>
      filterUserMeetings(
        getTodaysMeetings(),
        currentUser,
      ),
    [currentUser],
  )

  const actionItems = useMemo(
    () =>
      getActionItemsFromMeetings(
        meetings,
      ),
    [meetings],
  )

  /*
   * Prefer a meeting that is currently Live for the Up Next card.
   * If nothing is live, use the next Upcoming meeting.
   */
  const liveMeeting = useMemo(
    () =>
      meetings.find((meeting) => {
        if (!meeting?.start || !meeting?.end) {
          return false
        }

        const start =
          meeting.start instanceof Date
            ? meeting.start
            : new Date(meeting.start)

        const end =
          meeting.end instanceof Date
            ? meeting.end
            : new Date(meeting.end)

        return (
          start <= now &&
          now < end
        )
      }) ?? null,
    [meetings, now],
  )

  const nextUpcomingMeeting = useMemo(
    () =>
      meetings
        .filter((meeting) => {
          if (!meeting?.start) {
            return false
          }

          const start =
            meeting.start instanceof Date
              ? meeting.start
              : new Date(meeting.start)

          return start > now
        })
        .sort(
          (a, b) =>
            new Date(a.start).getTime() -
            new Date(b.start).getTime(),
        )[0] ?? null,
    [meetings, now],
  )

  /*
   * The Up Next card should show the Live meeting first.
   * Otherwise it shows the next upcoming meeting.
   */
  const nextMeeting =
    liveMeeting ??
    nextUpcomingMeeting

  /* Same shared MeetAI settings storage as CalendarPage. */
  const [
    meetingSettings,
    setMeetingSettings,
  ] = useState(() =>
    createMeetingSettings(meetings),
  )

  const updateMeetingSettings = (
    id,
    patch,
  ) => {
    setMeetingSettings(
      saveMeetingSettings(
        id,
        patch,
      ),
    )
  }

  const firstName =
    currentUser?.name?.split(' ')[0] ??
    'there'

  return (
    <>
      <DashboardHeader
        now={now}
        firstName={firstName}
        onCreate={openCreate}
        onInstant={openInstant}
      />

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
          <UpNextCard
            meeting={nextMeeting}
            meetings={meetings}
            now={now}
          />

          <Box data-tour="dashboard-todays-meetings">
            <ScheduleCard
              meetings={meetings}
              now={now}
              nextId={
                nextUpcomingMeeting?.id
              }
              settings={meetingSettings}
              onSettingsChange={
                updateMeetingSettings
              }
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
          <ActionItemCountCard
            count={actionItems.length}
          />

          <Box data-tour="dashboard-next-meeting">
            <NextMeetingCard
              meeting={nextUpcomingMeeting}
              now={now}
            />
          </Box>

          <ActionItemsCard
            items={actionItems}
          />
        </Box>
      </Box>
    </>
  )
}