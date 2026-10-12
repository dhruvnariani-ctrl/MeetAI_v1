import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'

import { gradientButtonSx, outlinedPillSx } from '../../ButtonStyles'

const dateFmt = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function getGreeting(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/* Date, greeting and the two top-right action buttons. */
export default function DashboardHeader({ now, firstName, onCreate, onInstant }) {
  return (
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
          sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}
        >
          <time dateTime={now.toLocaleDateString('en-CA')}>
            {dateFmt.format(now)}
          </time>
        </Typography>

        <Typography variant="h1" component="h1" sx={{ mt: 0.25 }}>
          {getGreeting(now.getHours())}, {firstName}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Button
          data-tour="dashboard-new-meeting"
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          onClick={onCreate}
          sx={gradientButtonSx(36)}
        >
          Create new meeting
        </Button>

        <Button
          variant="outlined"
          startIcon={<VideocamOutlinedIcon />}
          onClick={onInstant}
          sx={outlinedPillSx(36)}
        >
          Add MeetAI to a Meeting
        </Button>
      </Box>
    </Box>
  )
}