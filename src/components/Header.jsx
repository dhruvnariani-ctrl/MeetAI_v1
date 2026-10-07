import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountMenu from './AccountMenu'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

import Logo from './Logo'

import { getTodaysMeetings } from '../data/Dashboard'
import { startAppTour } from './TourRunner'
import { APP_TOUR_STEPS } from '../data/tours'
// Header: sidebar toggle, logo, search and profile.
export default function Header({
  navOpen,
  onToggleNav,
  query,
  onQueryChange,
}) {
  const navigate = useNavigate()
  const searchRef = useRef(null)

  /*
   * Existing meeting data source.
   */
  const meetings = useMemo(
    () => getTodaysMeetings(),
    [],
  )

  /*
   * Search meetings by:
   * - title
   * - platform
   * - participant name
   * - participant email
   */
  const matchingMeetings = useMemo(() => {
    const searchValue = query
      .trim()
      .toLowerCase()

    if (!searchValue) {
      return []
    }

    return meetings
      .filter((meeting) => {
        const title =
          meeting.title?.toLowerCase() || ''

        const platform =
          meeting.platform?.toLowerCase() || ''

        const participants =
          Array.isArray(meeting.participants)
            ? meeting.participants
                .map(
                  (person) =>
                    `${person.name || ''} ${
                      person.email || ''
                    }`,
                )
                .join(' ')
                .toLowerCase()
            : ''

        return (
          title.includes(searchValue) ||
          platform.includes(searchValue) ||
          participants.includes(searchValue)
        )
      })
      .slice(0, 6)
  }, [meetings, query])

  /*
   * Close search results when clicking outside.
   */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target,
        )
      ) {
        // Keep the search text, but blur the
        // dropdown naturally by clearing it.
        // The parent owns the query state.
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      )
    }
  }, [])

  /*
   * Open meeting details.
   */
  const handleMeetingClick = (meeting) => {
    onQueryChange('')

    navigate(`/meetings/${meeting.id}`, {
      state: {
        meeting,
        meetingId: meeting.id,
      },
    })
  }

  /*
   * Keyboard handling.
   */
  const handleSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      onQueryChange('')
      return
    }

    if (
      event.key === 'Enter' &&
      matchingMeetings.length > 0
    ) {
      event.preventDefault()

      handleMeetingClick(
        matchingMeetings[0],
      )
    }
  }

  const showDropdown =
    query.trim().length > 0

  return (
    <AppBar
      component="header"
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: '#fff',
        borderBottom: '1px solid',
        borderColor: 'divider',
        overflow: 'visible',
      }}
    >
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          px: 1,
          gap: 2,
          overflow: 'visible',
        }}
      >
        {/* ================================================== */}
        {/* SIDEBAR + LOGO                                     */}
        {/* ================================================== */}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: {
              md: 259,
            },
            flexShrink: 0,
          }}
        >
          <Tooltip
            title={
              navOpen
                ? 'Collapse navigation'
                : 'Expand navigation'
            }
          >
            <IconButton
              aria-label={
                navOpen
                  ? 'Collapse navigation'
                  : 'Expand navigation'
              }
              aria-expanded={navOpen}
              aria-controls="sidebar"
              onClick={onToggleNav}
              sx={{
                color: 'primary.main',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              flex: 1,
              display: {
                xs: 'none',
                md: 'flex',
              },
              justifyContent: 'center',
            }}
          >
            <Logo />
          </Box>
        </Box>

        {/* ================================================== */}
        {/* SEARCH                                             */}
        {/* ================================================== */}

        <Box
          ref={searchRef}
          data-tour="header-search"
          sx={{
            position: 'relative',
            flex: 1,
            maxWidth: 720,
          }}
        >
          <Paper
            component="form"
            role="search"
            elevation={0}
            onSubmit={(event) =>
              event.preventDefault()
            }
            sx={{
              width: '100%',
              height: 40,

              display: 'flex',
              alignItems: 'center',

              gap: 1,
              px: 2,

              borderRadius: '20px',

              border: '1px solid',
              borderColor:
                showDropdown
                  ? '#0d68c9'
                  : 'divider',

              color: 'text.secondary',

              transition:
                'border-color 160ms ease, box-shadow 160ms ease',

              '&:focus-within': {
                outline:
                  '3px solid rgba(13, 98, 201, 0.12)',
                outlineOffset: 1,
                borderColor: '#0d68c9',
              },
            }}
          >
            <SearchIcon
              sx={{
                fontSize: 22,
                flexShrink: 0,
                color: '#718198',
              }}
            />

            <InputBase
              type="search"
              placeholder="Search meetings"
              value={query}
              onChange={(event) =>
                onQueryChange(
                  event.target.value,
                )
              }
              onKeyDown={
                handleSearchKeyDown
              }
              inputProps={{
                'aria-label':
                  'Search meetings',
                autoComplete: 'off',
              }}
              sx={{
                flex: 1,
                minWidth: 0,
                fontSize: '0.9rem',

                '& input::placeholder': {
                  opacity: 1,
                  color: 'text.secondary',
                },
              }}
            />
          </Paper>

          {/* ================================================== */}
          {/* SEARCH RESULTS                                     */}
          {/* ================================================== */}

          {showDropdown && (
            <Paper
              elevation={0}
              sx={{
                position: 'absolute',
                top: 48,
                left: 0,
                right: 0,

                zIndex: 1300,

                border:
                  '1px solid #dce3eb',

                borderRadius: 2.5,

                bgcolor: '#fff',

                boxShadow:
                  '0 12px 32px rgba(15, 23, 42, 0.12)',

                overflow: 'hidden',

                animation:
                  'searchDropdownIn 140ms ease-out',

                '@keyframes searchDropdownIn':
                  {
                    from: {
                      opacity: 0,
                      transform:
                        'translateY(-4px)',
                    },
                    to: {
                      opacity: 1,
                      transform:
                        'translateY(0)',
                    },
                  },
              }}
            >
              {matchingMeetings.length > 0 ? (
                <Box>
                  <Box
                    sx={{
                      px: 2,
                      py: 1.25,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#7b8ba1',
                        textTransform:
                          'uppercase',
                        letterSpacing:
                          '0.04em',
                      }}
                    >
                      Meetings
                    </Typography>
                  </Box>

                  <Divider />

                  {matchingMeetings.map(
                    (meeting) => (
                      <Box
                        key={meeting.id}
                        component="button"
                        type="button"
                        onClick={() =>
                          handleMeetingClick(
                            meeting,
                          )
                        }
                        sx={{
                          width: '100%',

                          display: 'flex',
                          alignItems:
                            'center',

                          gap: 1.25,

                          px: 2,
                          py: 1.25,

                          border: 0,
                          bgcolor:
                            'transparent',

                          textAlign: 'left',

                          cursor: 'pointer',

                          transition:
                            'background-color 140ms ease',

                          '&:hover': {
                            bgcolor:
                              '#f5f8fc',
                          },

                          '&:focus-visible':
                            {
                              outline:
                                '2px solid #0d68c9',
                              outlineOffset:
                                -2,
                            },
                        }}
                      >
                        {/* Meeting icon */}

                        <Box
                          sx={{
                            width: 34,
                            height: 34,

                            borderRadius: 1.5,

                            display: 'grid',
                            placeItems:
                              'center',

                            bgcolor:
                              '#eaf2fd',

                            color:
                              '#0d68c9',

                            flexShrink: 0,
                          }}
                        >
                          <CalendarMonthOutlinedIcon
                            sx={{
                              fontSize: 18,
                            }}
                          />
                        </Box>

                        {/* Meeting information */}

                        <Box
                          sx={{
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize:
                                '0.82rem',

                              fontWeight: 600,

                              color:
                                '#172b46',

                              overflow:
                                'hidden',

                              textOverflow:
                                'ellipsis',

                              whiteSpace:
                                'nowrap',
                            }}
                          >
                            {meeting.title ||
                              'Untitled meeting'}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.25,

                              fontSize:
                                '0.7rem',

                              color:
                                '#718198',

                              overflow:
                                'hidden',

                              textOverflow:
                                'ellipsis',

                              whiteSpace:
                                'nowrap',
                            }}
                          >
                            {meeting.platform ||
                              'Meeting'}
                            {meeting.start
                              ? ` · ${formatSearchDate(
                                  meeting.start,
                                )}`
                              : ''}
                          </Typography>
                        </Box>
                      </Box>
                    ),
                  )}

                  {matchingMeetings.length >=
                    6 && (
                    <>
                      <Divider />

                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize:
                              '0.68rem',
                            color:
                              '#8793a3',
                          }}
                        >
                          Showing the first 6
                          matching meetings
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    px: 2.5,
                    py: 2.5,
                    textAlign: 'center',
                  }}
                >
                  <SearchIcon
                    sx={{
                      fontSize: 26,
                      color: '#a5b0be',
                      mb: 0.75,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize:
                        '0.82rem',
                      fontWeight: 600,
                      color:
                        '#42546b',
                    }}
                  >
                    No meetings found
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.35,
                      fontSize:
                        '0.7rem',
                      color:
                        '#8793a3',
                    }}
                  >
                    Try searching for a
                    meeting title or person.
                  </Typography>
                </Box>
              )}
            </Paper>
          )}
        </Box>

        {/* ================================================== */}
        {/* ACCOUNT                                            */}
        {/* ================================================== */}

        <Box
          sx={{
            ml: 'auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AccountMenu
  user={{
    name: 'Dhruv Nariani',
    email: 'dhruv@example.com',
    initials: 'D',
  }}
  onStartTour={() => {
    startAppTour(APP_TOUR_STEPS)
  }}
  // onLogout={onLogout}
  // profilePath="/profile"
  // settingsPath="/settings"
/>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

/* ====================================================== */
/* SEARCH DATE                                            */
/* ====================================================== */

function formatSearchDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  ).format(date)
}