import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'

import {
  formatTimeRange,
} from './utils'
import {formatDate} from '../../utils/time'
import { NotReadyMessage } from './ui'

export default function OverviewTab({
  meeting,
  meetingState,
  durationMinutes,
}) {
  const summary = meeting.meetingSummary

  return (
    <Stack spacing={2}>
      {/* ---------------------------------------------------------- */}
      {/* SUMMARY                                                     */}
      {/* ---------------------------------------------------------- */}

      <Paper
        elevation={0}
        sx={{
          border: '1px solid #dce3eb',
          borderRadius: 3,
          bgcolor: '#fff',
          p: {
            xs: 2,
            sm: 2.5,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 1.5 }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.5,
              display: 'grid',
              placeItems: 'center',
              bgcolor: '#eef4ff',
              color: '#245ea8',
            }}
          >
            <NotesOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: '.9rem',
                fontWeight: 700,
                color: '#24364d',
              }}
            >
              Meeting summary
            </Typography>

            <Typography
              sx={{
                mt: .15,
                fontSize: '.67rem',
                color: '#7b8ba1',
              }}
            >
              A quick overview of what was discussed
            </Typography>
          </Box>
        </Stack>

        {summary ? (
          <Typography
            sx={{
              fontSize: '.82rem',
              lineHeight: 1.8,
              color: '#52657d',
              whiteSpace: 'pre-line',
            }}
          >
            {summary}
          </Typography>
        ) : meetingState?.type === 'upcoming' ? (
          <NotReadyMessage>
            The meeting summary will appear here after
            the meeting has taken place.
          </NotReadyMessage>
        ) : (
          <NotReadyMessage>
            No meeting summary is available yet.
          </NotReadyMessage>
        )}
      </Paper>

      {/* ---------------------------------------------------------- */}
      {/* MEETING INFORMATION                                        */}
      {/* ---------------------------------------------------------- */}

      <Paper
        elevation={0}
        sx={{
          border: '1px solid #dce3eb',
          borderRadius: 3,
          bgcolor: '#fff',
          p: {
            xs: 2,
            sm: 2.5,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: '.9rem',
            fontWeight: 700,
            color: '#24364d',
            mb: 1.5,
          }}
        >
          Meeting information
        </Typography>

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
            label="Date"
            value={formatDate(meeting.start)}
          />

          <Info
            icon={<AccessTimeOutlinedIcon />}
            label="Time"
            value={formatTimeRange(
              meeting.start,
              meeting.end,
            )}
          />

          <Info
            icon={<AccessTimeOutlinedIcon />}
            label="Duration"
            value={`${durationMinutes} minutes`}
          />
        </Box>
      </Paper>
    </Stack>
  )
}

function Info({
  icon,
  label,
  value,
}) {
  return (
    <Box
      sx={{
        p: 1.35,
        borderRadius: 2,
        bgcolor: '#f8fafc',
        border: '1px solid #e7edf3',
      }}
    >
      <Stack
        direction="row"
        spacing={.7}
        alignItems="center"
      >
        <Box
          sx={{
            display: 'flex',
            color: '#718198',

            '& svg': {
              fontSize: 16,
            },
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            fontSize: '.66rem',
            color: '#7b8ba1',
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Typography
        sx={{
          mt: .6,
          fontSize: '.78rem',
          fontWeight: 700,
          color: '#24364d',
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}