import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'

import MeetingStatusArea from './MeetingStatusArea'

export default function MeetingHeader({
  meeting,
  meetingState,
  dateText,
  timeText,
  durationMinutes,
}) {
  const participantCount =
    meeting?.participants?.length || 0

  return (
    <Paper
      data-tour="meeting-header"
      elevation={0}
      sx={{
        border: '1px solid #dce3eb',
        borderRadius: 3,
        bgcolor: '#fff',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
        }}
      >
        <Stack spacing={2.25}>
          {/* Title + status */}
          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            spacing={2}
            alignItems={{
              xs: 'flex-start',
              sm: 'flex-start',
            }}
            justifyContent="space-between"
          >
            <Box
              sx={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: '1.2rem',
                    sm: '1.4rem',
                    md: '1.55rem',
                  },
                  fontWeight: 750,
                  lineHeight: 1.25,
                  color: '#172b46',
                  letterSpacing: '-.015em',
                }}
              >
                {meeting.title}
              </Typography>

              <Typography
                sx={{
                  mt: .75,
                  fontSize: '.8rem',
                  color: '#66778d',
                }}
              >
                {meeting.platform || 'Meeting'} · {dateText}
              </Typography>
            </Box>

            <MeetingStatusArea
              meeting={meeting}
              state={meetingState}
            />
          </Stack>

          {/* Main meeting information */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(3, 1fr)',
              },
              gap: 1,
            }}
          >
            <Info
              icon={<CalendarMonthOutlinedIcon />}
              label="Date & time"
              value={timeText}
              secondary={dateText}
            />

            <Info
              icon={<AccessTimeOutlinedIcon />}
              label="Duration"
              value={`${durationMinutes} minutes`}
              secondary="Scheduled meeting length"
            />

            <Info
              icon={<GroupsOutlinedIcon />}
              label="People invited"
              value={`${participantCount} ${
                participantCount === 1
                  ? 'person'
                  : 'people'
              }`}
              secondary="See attendance below"
            />
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}

function Info({
  icon,
  label,
  value,
  secondary,
}) {
  return (
    <Box
      sx={{
        p: 1.35,
        borderRadius: 2,
        bgcolor: '#f8fafc',
        border: '1px solid #e7edf3',
        minWidth: 0,
      }}
    >
      <Stack
        direction="row"
        spacing={.8}
        alignItems="center"
      >
        <Box
          sx={{
            display: 'flex',
            color: '#60748b',

            '& svg': {
              fontSize: 17,
            },
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            fontSize: '.67rem',
            fontWeight: 600,
            color: '#7b8ba1',
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Typography
        sx={{
          mt: .65,
          fontSize: '.8rem',
          fontWeight: 700,
          color: '#24364d',
          lineHeight: 1.35,
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          mt: .25,
          fontSize: '.65rem',
          color: '#8997a8',
        }}
      >
        {secondary}
      </Typography>
    </Box>
  )
}