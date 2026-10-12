import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined'

import { getParticipantCount, hasParticipants } from './meetingHelpers'

/* Left column of a meeting row: time, title, platform and participant count. */
export default function MeetingInfo({ meeting, timeLabel }) {
  const participantCount = getParticipantCount(meeting.participants)
  const showParticipants = hasParticipants(meeting.participants)

  return (
    <Box sx={{ minWidth: 0, gridColumn: '1 / 2' }}>
      <Typography
        sx={{
          fontSize: '0.78rem',
          lineHeight: 1.25,
          color: '#48658d',
          fontWeight: 500,
          mb: 0.6,
          userSelect: 'none',
        }}
      >
        {timeLabel}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: '0.95rem', md: '1rem' },
          lineHeight: 1.3,
          fontWeight: 700,
          color: '#0f172a',
          mb: 0.65,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {meeting.title}
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ flexWrap: 'wrap', rowGap: 0.5 }}
      >
        {meeting.platform && (
          <Typography sx={{ fontSize: '0.78rem', color: '#48658d', fontWeight: 500 }}>
            {meeting.platform}
          </Typography>
        )}

        {meeting.platform && showParticipants && (
          <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#a8b3c2' }} />
        )}

        {showParticipants && (
          <Stack direction="row" spacing={0.4} alignItems="center">
            <PeopleOutlineIcon sx={{ fontSize: 16, color: '#64748b' }} />
            <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>
              {participantCount}{' '}
              {participantCount === 1 ? 'participant' : 'participants'}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}