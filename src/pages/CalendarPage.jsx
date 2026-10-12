import { useOutletContext } from 'react-router-dom'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import PageShell from '../components/PageShell'
import CalendarSidebar from '../components/calendar/CalendarSidebar'
import CalendarToolbar from '../components/calendar/CalendarToolbar'
import CalendarFilters from '../components/calendar/CalendarFilters'
import CalendarMeetingList from '../components/calendar/CalendarMeetingList'

import useCalendarState from '../hooks/useCalenderState'
import useCurrentUser from '../hooks/useCurrentUser'

export default function CalendarPage() {
  /* "New meeting" opens the same Create Event dialog as Dashboard. */
  const { openCreate } = useOutletContext()

  const currentUser = useCurrentUser()

  const calendar = useCalendarState(currentUser)

  const count = calendar.visibleMeetings.length

  return (
    <PageShell
      title="Calendar"
      subtitle="See your meetings and choose a day."
    >
      <Stack spacing={2.5}>
        <Box data-tour="calendar-date-navigation">
          <CalendarToolbar
            view={calendar.view}
            onViewChange={calendar.setView}
            onPrevious={calendar.handlePrevious}
            onNext={calendar.handleNext}
            onToday={calendar.handleToday}
            onYesterday={calendar.handleYesterday}
            onTomorrow={calendar.handleTomorrow}
            onCurrentPeriod={calendar.handleCurrentPeriod}
            selectedDateLabel={calendar.selectedDateLabel}
            autoJoin={calendar.allVisibleAutoJoin}
            onAutoJoinChange={calendar.handleToolbarAutoJoin}
            onNewMeeting={() => openCreate?.()}
          />
        </Box>

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
          <CalendarSidebar
            selectedDate={calendar.selectedDate}
            view={calendar.view}
            meetings={calendar.meetings}
            onSelectDate={calendar.selectDay}
          />

          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ mb: 1.5 }}>
              <Box
                component="h2"
                sx={{
                  m: 0,
                  fontSize: '1.05rem',
                  lineHeight: 1.3,
                  fontWeight: 600,
                }}
              >
                {calendar.title}
              </Box>

              <Box
                sx={{
                  mt: 0.25,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                }}
              >
                {count} {count === 1 ? 'meeting' : 'meetings'}
              </Box>
            </Box>

            <Box data-tour="calendar-filters">
              <CalendarFilters
                value={calendar.filter}
                onChange={calendar.setFilter}
              />
            </Box>

            <Box data-tour="calendar-meeting-list">
              <CalendarMeetingList
                meetings={calendar.visibleMeetings}
                view={calendar.view}
                settings={calendar.settings}
                onSettingsChange={calendar.onSettingsChange}
              />
            </Box>
          </Box>
        </Box>
      </Stack>
    </PageShell>
  )
}