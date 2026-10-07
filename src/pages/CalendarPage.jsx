import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import PageShell from '../components/PageShell'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import CalendarSidebar from '../components/calendar/CalendarSidebar'
import CalendarToolbar from '../components/calendar/CalendarToolbar'
import CalendarFilters from '../components/calendar/CalendarFilters'
import CalendarMeetingList from '../components/calendar/CalendarMeetingList'

import { getTodaysMeetings } from '../data/Dashboard'

const formatMeetingTime = (start, end) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return `${formatter.format(new Date(start))} – ${formatter.format(
    new Date(end),
  )}`
}

const getMeetingType = (
  start,
  end,
  now = new Date(),
) => {
  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()
  const nowMs = new Date(now).getTime()

  if (nowMs >= endMs) return 'Done'
  if (nowMs >= startMs && nowMs < endMs) return 'Live'

  return 'Upcoming'
}

const pad = (value) =>
  String(value).padStart(2, '0')

const dateKey = (date) =>
  `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}`

/*
 * Calendar uses the same meetings as the dashboard.
 *
 * Any meeting returned by data/Dashboard.js
 * is available here.
 */
const getCalendarMeetings = () =>
  getTodaysMeetings().map((meeting) => ({
    ...meeting,

    date: dateKey(
      new Date(meeting.start),
    ),

    time: formatMeetingTime(
      meeting.start,
      meeting.end,
    ),

    participants: Array.isArray(
      meeting.participants,
    )
      ? meeting.participants.length
      : 0,

    type: getMeetingType(
      meeting.start,
      meeting.end,
    ),
  }))

const parseDate = (value) => {
  const [
    year,
    month,
    day,
  ] = value.split('-').map(Number)

  return new Date(
    year,
    month - 1,
    day,
  )
}

function startOfWeek(date) {
  const result = new Date(date)

  result.setHours(
    0,
    0,
    0,
    0,
  )

  const day = result.getDay()

  const difference =
    day === 0 ? -6 : 1 - day

  result.setDate(
    result.getDate() + difference,
  )

  return result
}

function endOfWeek(date) {
  const result = startOfWeek(date)

  result.setDate(
    result.getDate() + 6,
  )

  result.setHours(
    23,
    59,
    59,
    999,
  )

  return result
}

function formatDayTitle(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  ).format(date)
}

function formatWeekTitle(date) {
  const startText =
    new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
      },
    ).format(
      startOfWeek(date),
    )

  const endText =
    new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      },
    ).format(
      endOfWeek(date),
    )

  return `${startText} – ${endText}`
}

function formatMonthTitle(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'long',
      year: 'numeric',
    },
  ).format(date)
}

function getQuickDateLabel(date) {
  const today = new Date()

  today.setHours(
    0,
    0,
    0,
    0,
  )

  const target = new Date(date)

  target.setHours(
    0,
    0,
    0,
    0,
  )

  const difference = Math.round(
    (target - today) /
      (1000 * 60 * 60 * 24),
  )

  if (difference === 0) {
    return 'Today'
  }

  if (difference === -1) {
    return 'Yesterday'
  }

  if (difference === 1) {
    return 'Tomorrow'
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  ).format(target)
}

export default function CalendarPage() {
  /*
   * New meeting opens the same Create Event
   * dialog as the Dashboard.
   */
  const {
    openCreate,
  } = useOutletContext()

  const meetings = useMemo(
    () => getCalendarMeetings(),
    [],
  )

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    () => new Date(),
  )

  const [
    view,
    setView,
  ] = useState('day')

  const [
    filter,
    setFilter,
  ] = useState('All')

  /*
   * Per-meeting settings.
   *
   * Example:
   *
   * {
   *   m2: {
   *     autoJoin: true,
   *     recordVideo: false
   *   }
   * }
   */
  const [
    settings,
    setSettings,
  ] = useState({})

  const selectedKey =
    dateKey(selectedDate)

  /*
   * Change settings for ONE meeting.
   *
   * Used by MeetingToggles.
   */
  const onSettingsChange = (
    meetingId,
    changes,
  ) => {
    setSettings((current) => ({
      ...current,

      [meetingId]: {
        ...current[meetingId],
        ...changes,
      },
    }))
  }

  /*
   * Meetings for the current
   * Day / Week / Month + status filter.
   */
  const visibleMeetings = useMemo(() => {
    let result = [...meetings]

    if (view === 'day') {
      result = result.filter(
        (meeting) =>
          meeting.date ===
          selectedKey,
      )
    }

    if (view === 'week') {
      const start =
        startOfWeek(
          selectedDate,
        )

      const end =
        endOfWeek(
          selectedDate,
        )

      result = result.filter(
        (meeting) => {
          const meetingDate =
            parseDate(
              meeting.date,
            )

          return (
            meetingDate >= start &&
            meetingDate <= end
          )
        },
      )
    }

    if (view === 'month') {
      result = result.filter(
        (meeting) => {
          const meetingDate =
            parseDate(
              meeting.date,
            )

          return (
            meetingDate.getFullYear() ===
              selectedDate.getFullYear() &&
            meetingDate.getMonth() ===
              selectedDate.getMonth()
          )
        },
      )
    }

    if (filter !== 'All') {
      result = result.filter(
        (meeting) =>
          meeting.type === filter,
      )
    }

    /*
     * Sort by date, then time.
     */
    return result.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(
          b.date,
        )
      }

      return a.time.localeCompare(
        b.time,
      )
    })
  }, [
    meetings,
    selectedDate,
    selectedKey,
    view,
    filter,
  ])

  /*
   * Overall Invite MeetAI state.
   *
   * IMPORTANT:
   *
   * 1. If the user has changed a meeting,
   *    use settings[meeting.id].autoJoin.
   *
   * 2. Otherwise use:
   *    meeting.meetAI.invited
   *
   * 3. The toolbar is ON only when EVERY
   *    visible meeting is invited.
   */
  const allVisibleAutoJoin =
    visibleMeetings.length > 0 &&
    visibleMeetings.every(
      (meeting) => {
        return (
          settings?.[
            meeting.id
          ]?.autoJoin ??
          meeting?.meetAI?.invited ??
          false
        )
      },
    )

  /*
   * Toolbar Invite MeetAI switch.
   *
   * Turning it ON:
   *   -> Invite MeetAI for every visible meeting.
   *
   * Turning it OFF:
   *   -> Remove MeetAI from every visible meeting.
   *   -> Also turn video recording OFF.
   */
  const handleToolbarAutoJoin = (
    checked,
  ) => {
    setSettings((current) => {
      const next = {
        ...current,
      }

      visibleMeetings.forEach(
        (meeting) => {
          next[meeting.id] = {
            ...next[meeting.id],

            autoJoin: checked,

            /*
             * Keep video independent when
             * enabling MeetAI.
             *
             * When MeetAI is disabled,
             * video recording is also disabled.
             */
            ...(checked
              ? {}
              : {
                  recordVideo:
                    false,
                }),
          }
        },
      )

      return next
    })
  }

  /*
   * Today / Yesterday / Tomorrow
   * are day selections.
   */
  const selectQuickDate = (
    offset,
  ) => {
    const next = new Date()

    next.setHours(
      0,
      0,
      0,
      0,
    )

    next.setDate(
      next.getDate() + offset,
    )

    setSelectedDate(next)
    setView('day')
  }

  const handleToday = () => {
    selectQuickDate(0)
  }

  const handleYesterday = () => {
    selectQuickDate(-1)
  }

  const handleTomorrow = () => {
    selectQuickDate(1)
  }

  /*
   * Previous / Next:
   *
   * Day   -> 1 day
   * Week  -> 1 week
   * Month -> 1 month
   */
  const navigateCalendar = (
    direction,
  ) => {
    const next = new Date(
      selectedDate,
    )

    if (view === 'day') {
      next.setDate(
        next.getDate() +
          direction,
      )
    }

    if (view === 'week') {
      next.setDate(
        next.getDate() +
          direction * 7,
      )
    }

    if (view === 'month') {
      next.setDate(1)

      next.setMonth(
        next.getMonth() +
          direction,
      )
    }

    setSelectedDate(next)
  }

  const handlePrevious = () => {
    navigateCalendar(-1)
  }

  const handleNext = () => {
    navigateCalendar(1)
  }

  const title =
    view === 'day'
      ? formatDayTitle(
          selectedDate,
        )
      : view === 'week'
        ? formatWeekTitle(
            selectedDate,
          )
        : formatMonthTitle(
            selectedDate,
          )

  const selectedDateLabel =
    getQuickDateLabel(
      selectedDate,
    )

  /*
   * Open Create Meeting dialog.
   */
  const handleNewMeeting = () => {
    openCreate?.()
  }

  /*
   * Select a day from the sidebar.
   */
  const selectDay = (date) => {
    setSelectedDate(date)
    setView('day')
  }

  return (
    <PageShell
      title="Calendar"
      subtitle="See your meetings and choose a day."
    >
      <Stack spacing={2.5}>
        {/* ============================================================ */}
        {/* CALENDAR TOOLBAR                                             */}
        {/* ============================================================ */}

        <Box data-tour="calendar-date-navigation">
          <CalendarToolbar
            view={view}
            onViewChange={setView}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
            onYesterday={
              handleYesterday
            }
            onTomorrow={
              handleTomorrow
            }
            selectedDateLabel={
              selectedDateLabel
            }
            meetings={
              visibleMeetings
            }
            settings={settings}
            onAutoJoinChange={
              onSettingsChange
            }
            onNewMeeting={
              handleNewMeeting
            }
          />
        </Box>

        {/* ============================================================ */}
        {/* CALENDAR CONTENT                                             */}
        {/* ============================================================ */}

        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',
              md: '220px minmax(0, 1fr)',
            },

            gap: 3,

            alignItems: 'start',
          }}
        >
          {/* ======================================================== */}
          {/* SIDEBAR CALENDAR                                         */}
          {/* ======================================================== */}

          <CalendarSidebar
            selectedDate={
              selectedDate
            }
            view={view}
            meetings={meetings}
            onSelectDate={
              selectDay
            }
          />

          {/* ======================================================== */}
          {/* MAIN MEETING CONTENT                                     */}
          {/* ======================================================== */}

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                mb: 1.5,
              }}
            >
              <Box
                component="h2"
                sx={{
                  m: 0,

                  fontSize:
                    '1.05rem',

                  lineHeight: 1.3,

                  fontWeight: 600,
                }}
              >
                {title}
              </Box>

              <Box
                sx={{
                  mt: 0.25,

                  fontSize:
                    '0.75rem',

                  color:
                    'text.secondary',
                }}
              >
                {visibleMeetings.length}{' '}
                {visibleMeetings.length ===
                1
                  ? 'meeting'
                  : 'meetings'}
              </Box>
            </Box>

            {/* ====================================================== */}
            {/* CALENDAR FILTERS                                      */}
            {/* ====================================================== */}

            <Box
              data-tour="calendar-filters"
            >
              <CalendarFilters
                value={filter}
                onChange={
                  setFilter
                }
              />
            </Box>

            {/* ====================================================== */}
            {/* MEETING LIST                                           */}
            {/* ====================================================== */}

            <Box
              data-tour="calendar-meeting-list"
            >
              <CalendarMeetingList
                meetings={
                  visibleMeetings
                }
                view={view}
                settings={settings}
                onSettingsChange={
                  onSettingsChange
                }
                onSelectDate={
                  selectDay
                }
              />
            </Box>
          </Box>
        </Box>
      </Stack>
    </PageShell>
  )
}