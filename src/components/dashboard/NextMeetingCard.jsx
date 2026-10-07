import { useId } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { formatCountdown, formatRange } from '../../utils/time'

export default function NextMeetingCard({ meeting, now }) {
  const headingId = useId()
  return (
    <Paper
      component="section"
      aria-labelledby={headingId}
      variant="outlined"
      sx={{ p: 1.5, borderRadius: '20px', bgcolor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}
    >
      <Typography id={headingId} component="h2" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
        Next meeting in
      </Typography>
      {meeting ? (
        <>
          <Typography sx={{ my: 1, fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.1 }}>
            {formatCountdown(meeting.start - now)}
          </Typography>
          <Typography noWrap sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{meeting.title} {formatRange(meeting.start, meeting.end)}</Typography>
          </>
      ) : (
        <Typography sx={{ mt: 1, color: 'text.secondary' }}>No more meetings today.</Typography>
      )}
    </Paper>
  )
}