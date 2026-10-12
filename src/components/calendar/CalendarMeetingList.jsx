import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import MeetingListItem from '../meetings/MeetingListItem'

function formatDateHeading(dateString) {
  const [
    year,
    month,
    day,
  ] = dateString
    .split('-')
    .map(Number)

  const date = new Date(
    year,
    month - 1,
    day,
  )

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

function groupByDate(meetings) {
  return meetings.reduce(
    (groups, meeting) => {
      if (!groups[meeting.date]) {
        groups[meeting.date] = []
      }

      groups[meeting.date].push(
        meeting,
      )

      return groups
    },
    {},
  )
}

export default function CalendarMeetingList({
  meetings = [],
  view,
  settings = {},
  onSettingsChange,
}) {
  if (!meetings.length) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: '1px solid #e1e6ec',
          borderRadius: '18px',
          textAlign: 'center',
          bgcolor: '#fff',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          No meetings found
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: '0.78rem',
            color: 'text.secondary',
          }}
        >
          There are no meetings
          matching your current
          selection.
        </Typography>
      </Paper>
    )
  }

  const groupedMeetings =
    groupByDate(meetings)

  const firstMeetingId =
    Object.values(groupedMeetings)
      .flat()[0]?.id

  return (
    <Box>
      <Typography
        sx={{
          mb: 1.5,
          fontSize: '0.75rem',
          lineHeight: 1.4,
          color: '#64748b',
        }}
      >
        <Box
          component="span"
          sx={{
            color: '#94a3b8',
            fontWeight: 700,
            mr: 0.35,
          }}
        >
          *
        </Box>

        Double-click a meeting to open
        meeting details.
      </Typography>

      <Stack spacing={2}>
        {Object.entries(
          groupedMeetings,
        ).map(
          ([date, dateMeetings]) => (
            <Box key={date}>
              {view !== 'day' && (
                <Typography
                  sx={{
                    mb: 0.9,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#475569',
                  }}
                >
                  {formatDateHeading(
                    date,
                  )}
                </Typography>
              )}

              <Stack spacing={1.25}>
                {dateMeetings.map(
                  (meeting) => (
                    <MeetingListItem
                      key={meeting.id}
                      meeting={meeting}
                      status={
                        meeting.type
                      }
                      timeLabel={
                        meeting.time
                      }
                      settings={settings}
                      onSettingsChange={
                        onSettingsChange
                      }
                      tourTarget={
                        firstMeetingId ===
                        meeting.id
                      }
                    />
                  ),
                )}
              </Stack>
            </Box>
          ),
        )}
      </Stack>
    </Box>
  )
}