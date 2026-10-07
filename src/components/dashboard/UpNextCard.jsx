import { useId } from 'react'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { visuallyHidden } from '@mui/utils'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import { formatRange } from '../../utils/time'

export default function UpNextCard({ meeting }) {
  const headingId = useId()
  const n = meeting?.participants.length ?? 0

  return (
    <Paper
      component="section"
      aria-labelledby={headingId}
      variant="outlined"
      sx={{ p: 1.5, minHeight: 210, display: 'flex', flexDirection: 'column', bgcolor: '#e3eefc', borderColor: '#c5d9f5', borderRadius: '20px' }}
    >
      <Typography id={headingId} component="h2" sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#0b4a99' }}>
        Up next
      </Typography>

      {!meeting ? (
        <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>You have no more meetings today.</Typography>
      ) : (
        <>
          <Typography component="h3" sx={{ mt: 1, fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.25 }}>
            {meeting.title}
          </Typography>

          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary', fontSize: '0.875rem' }}>
            <AccessTimeIcon sx={{ fontSize: 18 }} aria-hidden="true" />
            <span>{formatRange(meeting.start, meeting.end)} · {meeting.platform}</span>
          </Box>

          {/* Bottom row: participants on the left, Join on the right */}
          <Box sx={{ mt: 'auto', pt: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AvatarGroup
                max={5}
                aria-hidden="true"
                sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.8rem', bgcolor: '#45586b', borderColor: '#e3eefc' } }}
              >
                {meeting.participants.map((p) => (
                  <Avatar key={p.email} alt="">{p.name.charAt(0)}</Avatar>
                ))}
              </AvatarGroup>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                {n} {n === 1 ? 'participant' : 'participants'}
              </Typography>
              <span style={visuallyHidden}>: {meeting.participants.map((p) => p.name).join(', ')}</span>
            </Box>

            <Button
              data-tour="dashboard-join-meeting"
              component="a"
              href={meeting.link}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              disableElevation
              startIcon={<VideocamOutlinedIcon />}
              aria-label={`Join ${meeting.title} (opens in a new tab)`}
              sx={{ height: 40, px: 3, borderRadius: '12px', fontSize: '0.9375rem' }}
            >
              Join
            </Button>
          </Box>
        </>
      )}
    </Paper>
  )
}