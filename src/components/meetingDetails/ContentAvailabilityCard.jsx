import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { SectionCard, NotReadyMessage } from './ui'

/* -------------------------------------------------------------------------- */
/* Content availability                                                       */
/* -------------------------------------------------------------------------- */

export default function ContentAvailabilityCard({
  title,
  icon,
  available,
  duration,
  meetingState,
  message,
}) {
  return (
    <SectionCard
      icon={icon}
      title={title}
    >
      {available ? (
        <Box>
          <Typography
            sx={{
              fontSize: '0.78rem',
              color: '#287a4d',
              fontWeight: 600,
            }}
          >
            Available
          </Typography>

          {duration && (
            <Typography
              sx={{
                mt: 0.25,
                fontSize: '0.7rem',
                color: '#7b8ba1',
              }}
            >
              {duration}
            </Typography>
          )}
        </Box>
      ) : (
        <NotReadyMessage>
          {meetingState?.type === 'upcoming'
            ? message
            : message.replace(
                'will be available here',
                'is not available for this meeting',
              )}
        </NotReadyMessage>
      )}
    </SectionCard>
  )
}
