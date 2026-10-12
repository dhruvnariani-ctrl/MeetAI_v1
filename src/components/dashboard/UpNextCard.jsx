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

export default function UpNextCard({
  meeting,
  meetings = [],
  now,
}) {
  const headingId = useId()

  const currentTime =
    now instanceof Date
      ? now
      : new Date(now)

  /*
   * Find a meeting that is happening right now.
   * Meeting start/end times are the source of truth.
   */
  const liveMeeting = meetings.find(
    (item) => {
      if (
        !item?.start ||
        !item?.end
      ) {
        return false
      }

      const start =
        item.start instanceof Date
          ? item.start
          : new Date(item.start)

      const end =
        item.end instanceof Date
          ? item.end
          : new Date(item.end)

      return (
        currentTime >= start &&
        currentTime < end
      )
    },
  )

  /*
   * Live meeting always takes priority over Up Next.
   */
  const displayedMeeting =
    liveMeeting ?? meeting ?? null

  const hasMeetingsToday =
    meetings.length > 0

  const isDoneForToday =
    !liveMeeting &&
    !meeting &&
    hasMeetingsToday

  const isEmpty =
    !liveMeeting &&
    !meeting &&
    !hasMeetingsToday

  const heading = liveMeeting
    ? 'Live now'
    : isDoneForToday
      ? 'Done for today'
      : isEmpty
        ? 'Today'
        : 'Up next'

  const participantCount =
    displayedMeeting?.participants?.length ?? 0

  return (
    <Paper
      component="section"
      aria-labelledby={headingId}
      variant="outlined"
      sx={{
        p: 1.5,
        minHeight: 210,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#e3eefc',
        borderColor: '#c5d9f5',
        borderRadius: '20px',
      }}
    >
      <Typography
        id={headingId}
        component="h2"
        sx={{
          fontSize: '0.875rem',
          fontWeight: 700,
          color: '#0b4a99',
        }}
      >
        {heading}
      </Typography>

      {isDoneForToday ? (
        <>
          <Typography
            component="h3"
            sx={{
              mt: 1,
              fontSize: '1.5rem',
              fontWeight: 700,
              lineHeight: 1.25,
            }}
          >
            You&apos;re all caught up
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            All of your meetings for today
            are done.
          </Typography>
        </>
      ) : isEmpty ? (
        <>
          <Typography
            component="h3"
            sx={{
              mt: 1,
              fontSize: '1.5rem',
              fontWeight: 700,
              lineHeight: 1.25,
            }}
          >
            No meetings today
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            You have no meetings scheduled
            for today.
          </Typography>
        </>
      ) : (
        <>
          <Typography
            component="h3"
            sx={{
              mt: 1,
              fontSize: '1.5rem',
              fontWeight: 700,
              lineHeight: 1.25,
            }}
          >
            {displayedMeeting.title}
          </Typography>

          <Box
            sx={{
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            <AccessTimeIcon
              sx={{ fontSize: 18 }}
              aria-hidden="true"
            />

            <span>
              {formatRange(
                displayedMeeting.start,
                displayedMeeting.end,
              )}
              {' · '}
              {displayedMeeting.platform}
            </span>
          </Box>

          {/* Bottom row: participants on the left, Join on the right */}
          <Box
            sx={{
              mt: 'auto',
              pt: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <AvatarGroup
                max={5}
                aria-hidden="true"
                sx={{
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    fontSize: '0.8rem',
                    bgcolor: '#45586b',
                    borderColor: '#e3eefc',
                  },
                }}
              >
                {(
                  displayedMeeting.participants ?? []
                ).map((p) => (
                  <Avatar
                    key={p.email}
                    alt=""
                  >
                    {p.name?.charAt(0) ?? '?'}
                  </Avatar>
                ))}
              </AvatarGroup>

              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                }}
              >
                {participantCount}{' '}
                {participantCount === 1
                  ? 'participant'
                  : 'participants'}
              </Typography>

              <span style={visuallyHidden}>
                :{' '}
                {(
                  displayedMeeting.participants ?? []
                )
                  .map((p) => p.name)
                  .join(', ')}
              </span>
            </Box>

            <Button
              data-tour="dashboard-join-meeting"
              component="a"
              href={displayedMeeting.link}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              disableElevation
              startIcon={
                <VideocamOutlinedIcon />
              }
              aria-label={`Join ${displayedMeeting.title} (opens in a new tab)`}
              sx={{
                height: 40,
                px: 3,
                borderRadius: '12px',
                fontSize: '0.9375rem',
              }}
            >
              Join
            </Button>
          </Box>
        </>
      )}
    </Paper>
  )
}