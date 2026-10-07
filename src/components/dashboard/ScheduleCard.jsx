import { useId, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import { formatRange } from '../../utils/time'
import InviteSwitch from '../InviteSwitch'
import MeetingToggles from '../MeetingToggles'

const STATUS_STYLES = {
  Live: {
    backgroundColor: '#fff0f0',
    color: '#c62828',
  },

  Upcoming: {
    backgroundColor: '#eaf3ff',
    color: '#1769aa',
  },

  Done: {
    backgroundColor: '#e7f6ee',
    color: '#237a4b',
  },
}

function getMeetingToggleSettings(meeting, localSettings) {
  return {
    autoJoin:
      localSettings?.autoJoin ??
      meeting?.meetAI?.invited ??
      false,

    recordVideo:
      localSettings?.recordVideo ??
      meeting?.meetAI?.recordVideo ??
      false,
  }
}

function getMeetingStatus(meeting, now, nextId) {
  if (meeting.id === nextId) {
    return 'Up next'
  }

  if (meeting.type === 'Live') {
    return 'Live'
  }

  if (
    meeting.type === 'Done' ||
    meeting.type === 'Completed'
  ) {
    return 'Done'
  }

  if (meeting.start > now) {
    return 'Upcoming'
  }

  return 'Done'
}

function getStatusStyle(status) {
  if (status === 'Live') {
    return STATUS_STYLES.Live
  }

  if (status === 'Done') {
    return STATUS_STYLES.Done
  }

  return STATUS_STYLES.Upcoming
}

function getParticipantCount(participants) {
  if (Array.isArray(participants)) {
    return participants.length
  }

  if (
    participants !== null &&
    participants !== undefined &&
    typeof participants === 'number'
  ) {
    return participants
  }

  return 0
}

function MeetingRow({
  meeting,
  now,
  nextId,
  settings,
  onSettingsChange,
}) {
  const navigate = useNavigate()

  const meetingSettings = getMeetingToggleSettings(
    meeting,
    settings?.[meeting.id],
  )

  const status = getMeetingStatus(
    meeting,
    now,
    nextId,
  )

  const statusStyle = getStatusStyle(status)

  const togglesDisabled = status === 'Done'

  const showToggles =
    status === 'Live' ||
    status === 'Upcoming' ||
    status === 'Up next' ||
    status === 'Done'

  const participantCount = getParticipantCount(
    meeting.participants,
  )

  const hasParticipants =
    Array.isArray(meeting.participants)
      ? meeting.participants.length > 0
      : meeting.participants !== null &&
        meeting.participants !== undefined

  const handleOpenMeeting = () => {
    navigate(`/meetings/${meeting.id}`)
  }

  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      handleOpenMeeting()
    }
  }

  const stopMeetingNavigation = (event) => {
    event.stopPropagation()
  }

  return (
    <Paper
      role="button"
      tabIndex={0}
      elevation={0}
      onDoubleClick={handleOpenMeeting}
      onKeyDown={handleKeyDown}
      sx={{
        border: '1px solid #e1e6ec',
        borderRadius: '18px',
        bgcolor: '#fff',
        overflow: 'hidden',
        cursor: 'default',
        transition:
          'border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease',

        '&:hover': {
          borderColor: '#c5d0df',
          boxShadow:
            '0 5px 18px rgba(15, 23, 42, 0.06)',
          bgcolor: '#fcfdff',

          '& .schedule-meeting-arrow': {
            opacity: 1,
            transform: 'translateX(2px)',
          },
        },

        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '2px',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr auto',
            md: 'minmax(0, 1fr) auto auto 24px',
          },

          alignItems: 'center',

          columnGap: {
            xs: 1,
            md: 2,
          },

          rowGap: {
            xs: 1,
            md: 0,
          },

          px: {
            xs: 1.75,
            md: 2.25,
          },

          py: {
            xs: 1.5,
            md: 1.75,
          },
        }}
      >
        {/* ============================================================ */}
        {/* Meeting information                                           */}
        {/* ============================================================ */}

        <Box
          sx={{
            minWidth: 0,

            gridColumn: {
              xs: '1 / 2',
              md: '1 / 2',
            },
          }}
        >
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
            {formatRange(
              meeting.start,
              meeting.end,
            )}
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: '0.95rem',
                md: '1rem',
              },

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
            sx={{
              flexWrap: 'wrap',
              rowGap: 0.5,
            }}
          >
            {meeting.platform && (
              <Typography
                sx={{
                  fontSize: '0.78rem',
                  color: '#48658d',
                  fontWeight: 500,
                }}
              >
                {meeting.platform}
              </Typography>
            )}

            {meeting.platform &&
              hasParticipants && (
                <Box
                  sx={{
                    width: 3,
                    height: 3,
                    borderRadius: '50%',
                    bgcolor: '#a8b3c2',
                  }}
                />
              )}

            {hasParticipants && (
              <Typography
                sx={{
                  fontSize: '0.78rem',
                  color: '#64748b',
                }}
              >
                {participantCount}{' '}
                {participantCount === 1
                  ? 'participant'
                  : 'participants'}
              </Typography>
            )}
          </Stack>
        </Box>

        {/* ============================================================ */}
        {/* Status                                                        */}
        {/* ============================================================ */}

        <Box
          onClick={stopMeetingNavigation}
          onMouseDown={stopMeetingNavigation}
          onPointerDown={stopMeetingNavigation}
          sx={{
            gridColumn: {
              xs: '2 / 3',
              md: '2 / 3',
            },

            alignSelf: {
              xs: 'start',
              md: 'center',
            },

            justifySelf: 'end',
          }}
        >
          <Box
            sx={{
              minWidth: {
                xs: 88,
                md: 104,
              },

              height: 32,
              px: 1.5,
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: statusStyle.backgroundColor,
              color: statusStyle.color,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.75rem',
                lineHeight: 1,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {status}
            </Typography>
          </Box>
        </Box>

        {/* ============================================================ */}
        {/* MeetAI controls                                               */}
        {/* ============================================================ */}

        {showToggles ? (
          <Box
            onClick={stopMeetingNavigation}
            onMouseDown={stopMeetingNavigation}
            onPointerDown={stopMeetingNavigation}
            sx={{
              gridColumn: {
                xs: '1 / 3',
                md: '3 / 4',
              },

              display: 'flex',
              alignItems: 'center',

              justifyContent: {
                xs: 'flex-start',
                md: 'flex-end',
              },

              minWidth: {
                md: 220,
              },

              pt: {
                xs: 1,
                md: 0,
              },

              mt: {
                xs: 0.25,
                md: 0,
              },

              borderTop: {
                xs: '1px solid #eef1f5',
                md: 'none',
              },
            }}
          >
            <Tooltip
              title={
                togglesDisabled
                  ? 'Meeting already done'
                  : ''
              }
              placement="top"
              arrow
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',

                  opacity: togglesDisabled
                    ? 0.7
                    : 1,

                  cursor: togglesDisabled
                    ? 'not-allowed'
                    : 'default',
                }}
              >
                <MeetingToggles
                  meeting={meeting}
                  settings={meetingSettings}
                  onChange={(changes) =>
                    onSettingsChange?.(
                      meeting.id,
                      changes,
                    )
                  }
                  disabled={togglesDisabled}
                />
              </Box>
            </Tooltip>
          </Box>
        ) : null}

        {/* ============================================================ */}
        {/* Arrow                                                         */}
        {/* ============================================================ */}

        <Box
          className="schedule-meeting-arrow"
          aria-hidden="true"
          sx={{
            display: {
              xs: 'none',
              md: 'flex',
            },

            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            opacity: 0.5,
            transform: 'translateX(0)',

            transition:
              'opacity 160ms ease, transform 160ms ease',
          }}
        >
          <ArrowForwardIosIcon
            sx={{
              fontSize: 15,
            }}
          />
        </Box>
      </Box>
    </Paper>
  )
}

export default function ScheduleCard({
  meetings = [],
  now,
  nextId,
  settings = {},
  onSettingsChange,
}) {
  const headingId = useId()

  /*
   * Overall MeetAI state.
   *
   * Local changes take priority over
   * meeting.meetAI.invited.
   */
  const allTodayMeetingsHaveMeetAI =
    meetings.length > 0 &&
    meetings.every((meeting) => {
      return (
        settings?.[meeting.id]?.autoJoin ??
        meeting?.meetAI?.invited ??
        false
      )
    })

  /*
   * Turn MeetAI on/off for every meeting.
   *
   * When MeetAI is disabled, recording
   * is also disabled.
   */
  const handleOverallMeetAIToggle = (
    checked,
  ) => {
    meetings.forEach((meeting) => {
      onSettingsChange?.(
        meeting.id,
        {
          autoJoin: checked,

          ...(checked
            ? {}
            : {
                recordVideo: false,
              }),
        },
      )
    })
  }

  /*
   * Keep meetings sorted by start time.
   */
  const sortedMeetings = useMemo(
    () =>
      [...meetings].sort((a, b) => {
        const aStart =
          a.start instanceof Date
            ? a.start.getTime()
            : new Date(a.start).getTime()

        const bStart =
          b.start instanceof Date
            ? b.start.getTime()
            : new Date(b.start).getTime()

        return aStart - bStart
      }),
    [meetings],
  )

  return (
    <Paper
      component="section"
      aria-labelledby={headingId}
      variant="outlined"
      sx={{
        p: {
          xs: 2,
          sm: 2.5,
        },

        borderRadius: '20px',

        bgcolor: '#fff',

        borderColor: '#e1e6ec',
      }}
    >
      {/* ================================================================ */}
      {/* Header                                                           */}
      {/* ================================================================ */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          id={headingId}
          component="h2"
          sx={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#0f172a',
          }}
        >
          Today&apos;s schedule
        </Typography>

        {/* Invite MeetAI FIRST, View calendar SECOND */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <InviteSwitch
            checked={
              allTodayMeetingsHaveMeetAI
            }
            onChange={
              handleOverallMeetAIToggle
            }
          />
          <Button
  size="small"
  data-tour="dashboard-calendar-link"
  endIcon={
    <ArrowForwardIcon
      sx={{
        fontSize: 16,
      }}
    />
  }
  sx={{
    fontSize: '0.78rem',
    fontWeight: 600,
    textTransform: 'none',
    color: '#48658d',
    minWidth: 0,
    px: 0.75,
  }}
>
  View calendar
</Button>
        </Stack>
      </Box>

      {/* ================================================================ */}
      {/* Interaction hint                                                 */}
      {/* ================================================================ */}

      {sortedMeetings.length > 0 && (
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

          Double-click a meeting to
          open meeting details.
        </Typography>
      )}

      {/* ================================================================ */}
      {/* Empty state                                                       */}
      {/* ================================================================ */}

      {sortedMeetings.length === 0 ? (
        <Box
          sx={{
            py: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            No meetings today
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: '0.78rem',
              color: 'text.secondary',
            }}
          >
            Your schedule is clear
            for today.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.25}>
          {sortedMeetings.map((meeting) => (
            <MeetingRow
              key={meeting.id}
              meeting={meeting}
              now={now}
              nextId={nextId}
              settings={settings}
              onSettingsChange={
                onSettingsChange
              }
            />
          ))}
        </Stack>
      )}
    </Paper>
  )
}