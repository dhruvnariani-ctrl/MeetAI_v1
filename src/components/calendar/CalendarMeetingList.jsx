import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

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

/**
 * Resolve the MeetAI toggle state.
 *
 * Priority:
 * 1. Local user changes
 * 2. Meeting data
 * 3. false
 */
function getMeetingToggleSettings(
  meeting,
  localSettings,
) {
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

function MeetingCard({
  meeting,
  settings,
  onSettingsChange,
  tourTarget = false,
}) {
  const navigate = useNavigate()

  const statusStyle =
    STATUS_STYLES[meeting.type] ??
    STATUS_STYLES.Upcoming

  /*
   * Live, Upcoming and Done meetings
   * all show the MeetAI controls.
   *
   * Done meetings have disabled controls.
   */
  const showToggles =
    meeting.type === 'Live' ||
    meeting.type === 'Upcoming' ||
    meeting.type === 'Done'

  const togglesDisabled =
    meeting.type === 'Done'

  const meetingSettings =
    getMeetingToggleSettings(
      meeting,
      settings?.[meeting.id],
    )

  const handleOpenMeeting = () => {
    navigate(
      `/meetings/${meeting.id}`,
    )
  }

  /*
   * Keyboard users can still open
   * meeting details without double-clicking.
   */
  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      handleOpenMeeting()
    }
  }

  /*
   * MeetAI controls must not trigger
   * meeting navigation.
   */
  const stopMeetingNavigation = (
    event,
  ) => {
    event.stopPropagation()
  }

  return (
    <Paper
      data-tour={
        tourTarget
          ? 'calendar-meeting'
          : undefined
      }
      elevation={0}
      role="button"
      tabIndex={0}
      onDoubleClick={handleOpenMeeting}
      onKeyDown={handleKeyDown}
      sx={{
        border:
          '1px solid #e1e6ec',

        borderRadius: '18px',

        bgcolor: '#fff',

        overflow: 'hidden',

        cursor: 'default',

        transition:
          'border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease',

        '&:hover': {
          borderColor:
            '#c5d0df',

          boxShadow:
            '0 5px 18px rgba(15, 23, 42, 0.06)',

          bgcolor:
            '#fcfdff',

          '& .meeting-arrow': {
            opacity: 1,

            transform:
              'translateX(2px)',
          },
        },

        '&:focus-visible': {
          outline: '2px solid',

          outlineColor:
            'primary.main',

          outlineOffset: '2px',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',

          /*
           * Desktop:
           *
           * meeting information
           * status
           * MeetAI controls
           * arrow
           */
          gridTemplateColumns: {
            xs: '1fr auto',
            md:
              'minmax(0, 1fr) auto auto 24px',
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
            md: 2.5,
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
            {meeting.time}
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
            <Typography
              sx={{
                fontSize: '0.78rem',

                color: '#48658d',

                fontWeight: 500,
              }}
            >
              {meeting.platform}
            </Typography>

            <Box
              sx={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                bgcolor: '#a8b3c2',
              }}
            />

            <Stack
              direction="row"
              spacing={0.4}
              alignItems="center"
            >
              <PeopleOutlineIcon
                sx={{
                  fontSize: 16,
                  color: '#64748b',
                }}
              />

              <Typography
                sx={{
                  fontSize: '0.78rem',

                  color: '#64748b',
                }}
              >
                {meeting.participants}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* ============================================================ */}
        {/* Status                                                        */}
        {/* ============================================================ */}

        <Box
          onClick={
            stopMeetingNavigation
          }
          onMouseDown={
            stopMeetingNavigation
          }
          onPointerDown={
            stopMeetingNavigation
          }
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
          <Chip
            label={meeting.type}
            size="small"
            sx={{
              height: 32,

              minWidth: {
                xs: 88,
                md: 104,
              },

              borderRadius: '999px',

              backgroundColor:
                statusStyle.backgroundColor,

              color:
                statusStyle.color,

              fontSize: '0.75rem',

              fontWeight: 700,

              userSelect: 'none',

              '& .MuiChip-label': {
                px: 1.5,
              },

              '&:focus': {
                outline: 'none',
              },
            }}
          />
        </Box>

        {/* ============================================================ */}
        {/* MeetAI controls                                               */}
        {/* ============================================================ */}

        {showToggles ? (
          <Box
            onClick={
              stopMeetingNavigation
            }
            onMouseDown={
              stopMeetingNavigation
            }
            onPointerDown={
              stopMeetingNavigation
            }
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
                xs:
                  '1px solid #eef1f5',
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

                  opacity:
                    togglesDisabled
                      ? 0.7
                      : 1,

                  cursor:
                    togglesDisabled
                      ? 'not-allowed'
                      : 'default',
                }}
              >
                <MeetingToggles
                  meeting={meeting}
                  settings={
                    meetingSettings
                  }
                  onChange={
                    onSettingsChange
                  }
                  disabled={
                    togglesDisabled
                  }
                />
              </Box>
            </Tooltip>
          </Box>
        ) : null}

        {/* ============================================================ */}
        {/* Arrow                                                         */}
        {/* ============================================================ */}

        <Box
          className="meeting-arrow"
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

            transform:
              'translateX(0)',

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

          border:
            '1px solid #e1e6ec',

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
      {/* ================================================================ */}
      {/* Meeting interaction hint                                         */}
      {/* ================================================================ */}

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

      {/* ================================================================ */}
      {/* Meeting groups                                                    */}
      {/* ================================================================ */}

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
                    <MeetingCard
                      key={
                        meeting.id
                      }
                      meeting={
                        meeting
                      }
                      settings={
                        settings
                      }
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