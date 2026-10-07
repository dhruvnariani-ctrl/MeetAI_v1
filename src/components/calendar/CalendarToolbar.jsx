import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined'
import AddIcon from '@mui/icons-material/Add'

import InviteSwitch from '../InviteSwitch'

const buttonSx = {
  minWidth: 145,
  justifyContent: 'space-between',
  textTransform: 'none',
  fontSize: '0.8rem',
  fontWeight: 500,
  borderColor: '#d8dee6',
  color: 'text.primary',
  px: 1.25,
  py: 0.65,
}

const VIEWS = [
  {
    value: 'day',
    label: 'Day',
  },
  {
    value: 'week',
    label: 'Week',
  },
  {
    value: 'month',
    label: 'Month',
  },
]

export default function CalendarToolbar({
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onYesterday,
  onTomorrow,
  selectedDateLabel = 'Today',

  /*
   * Current meetings visible in the calendar.
   *
   * These are used to calculate the overall
   * Invite MeetAI switch.
   */
  meetings = [],

  /*
   * Calendar settings.
   *
   * Local settings take priority over
   * meeting.meetAI.invited.
   */
  settings = {},

  /*
   * Called when the overall Invite MeetAI
   * switch is changed.
   *
   * Expected:
   *
   * onAutoJoinChange(meetingId, {
   *   autoJoin: true
   * })
   */
  onAutoJoinChange,

  // Opens the Create event dialog.
  onNewMeeting,
}) {
  const [anchorEl, setAnchorEl] =
    useState(null)

  const quickActions = [
    {
      label: 'Today',
      action: onToday,
    },
    {
      label: 'Yesterday',
      action: onYesterday,
    },
    {
      label: 'Tomorrow',
      action: onTomorrow,
    },
  ]

  /*
   * Overall Invite MeetAI state.
   *
   * ON when every currently displayed
   * calendar meeting has MeetAI invited.
   *
   * Local settings take priority.
   */
  const allMeetingsHaveMeetAI =
    meetings.length > 0 &&
    meetings.every((meeting) => {
      return (
        settings?.[meeting.id]?.autoJoin ??
        meeting?.meetAI?.invited ??
        false
      )
    })

  /*
   * Turn MeetAI on/off for every meeting
   * currently supplied to the toolbar.
   */
  const handleOverallMeetAIToggle = (
    checked,
  ) => {
    meetings.forEach((meeting) => {
      onAutoJoinChange?.(
        meeting.id,
        {
          autoJoin: checked,
        },
      )
    })
  }

  const handleQuickAction = (item) => {
    setAnchorEl(null)
    item.action?.()
  }

  return (
    <Box
      sx={{
        display: 'grid',

        gridTemplateColumns: {
          xs: '1fr',
          md: '1fr auto 1fr',
        },

        alignItems: 'center',

        gap: 1.5,

        mb: 2.5,
      }}
    >
      {/* ================================================================ */}
      {/* DATE DROPDOWN                                                    */}
      {/* ================================================================ */}

      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
      >
        <Button
          data-tour="calendar-date-menu"
          variant="outlined"
          startIcon={
            <TodayOutlinedIcon
              sx={{
                fontSize: 18,
              }}
            />
          }
          endIcon={
            <KeyboardArrowDownIcon
              sx={{
                fontSize: 18,
              }}
            />
          }
          onClick={(event) =>
            setAnchorEl(
              event.currentTarget,
            )
          }
          sx={buttonSx}
        >
          {selectedDateLabel}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() =>
            setAnchorEl(null)
          }
          MenuListProps={{
            'aria-label':
              'Choose date',
          }}
        >
          {quickActions.map(
            (item) => (
              <MenuItem
                key={item.label}
                onClick={() =>
                  handleQuickAction(
                    item,
                  )
                }
                sx={{
                  minWidth: 150,
                  fontSize:
                    '0.9rem',
                }}
              >
                {item.label}
              </MenuItem>
            ),
          )}
        </Menu>
      </Stack>

      {/* ================================================================ */}
      {/* CENTER CONTROLS                                                  */}
      {/* ================================================================ */}

      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        justifyContent="center"
      >
        <IconButton
          size="small"
          onClick={onPrevious}
          aria-label={`Previous ${view}`}
        >
          <ChevronLeftIcon
            fontSize="small"
          />
        </IconButton>

        <IconButton
          size="small"
          onClick={onNext}
          aria-label={`Next ${view}`}
        >
          <ChevronRightIcon
            fontSize="small"
          />
        </IconButton>

       <Box
  data-tour="calendar-view"
  sx={{
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 0.35,
    ml: 0.75,
    p: 0.35,
    borderRadius: 1.75,
    bgcolor: '#f5f7fa',
    flexShrink: 0,
  }}
>
  {/* Animated selected background */}
  <Box
    sx={{
      position: 'absolute',
      top: 3,
      left: 3,

      width: 55,
      height: 30,

      borderRadius: 1.35,

      bgcolor: '#0d68c9',

      boxShadow:
        '0 2px 6px rgba(13, 104, 201, 0.22)',

      transform: `translateX(${
        VIEWS.findIndex(
          ({ value }) => value === view,
        ) * 57
      }px)`,

      transition:
        'transform 220ms cubic-bezier(0.4, 0, 0.2, 1)',

      pointerEvents: 'none',
      zIndex: 0,
    }}
  />

  {VIEWS.map(({ value, label }) => {
    const selected = view === value

    return (
      <Button
        key={value}
        disableRipple
        onClick={() => onViewChange(value)}
        sx={{
          position: 'relative',
          zIndex: 1,

          minWidth: 55,
          width: 55,
          height: 30,

          px: 1,

          py: 0,

          border: 'none',
          borderRadius: 1.35,

          textTransform: 'none',

          fontSize: '0.75rem',

          fontWeight: selected
            ? 600
            : 500,

          color: selected
            ? '#fff'
            : '#52657d',

          bgcolor: 'transparent',

          transition:
            'color 180ms ease',

          '&:hover': {
            bgcolor: 'transparent',

            color: selected
              ? '#fff'
              : '#243b5a',
          },

          '&:focus': {
            bgcolor: 'transparent',
          },

          '&:focus-visible': {
            outline:
              '2px solid rgba(13, 104, 201, 0.35)',
            outlineOffset: 1,
          },
        }}
      >
        {label}
      </Button>
    )
  })}
</Box>
      </Stack>

      {/* ================================================================ */}
      {/* INVITE MEETAI + NEW MEETING                                      */}
      {/* ================================================================ */}

      <Box
        sx={{
          display: 'flex',

          alignItems: 'center',

          justifyContent: {
            xs: 'flex-start',
            md: 'flex-end',
          },
        }}
      >
        <Box
          data-tour="invite-meetai"
          sx={{
            mr: 2,
            fontSize:
              '0.78rem',
            fontWeight: 600,
            p: '4px',
          }}
        >
          <InviteSwitch
            checked={
              allMeetingsHaveMeetAI
            }
            onChange={
              handleOverallMeetAIToggle
            }
          />
        </Box>

        <Button
          data-tour="new-meeting"
          size="small"
          variant="contained"
          startIcon={
            <AddIcon />
          }
          onClick={onNewMeeting}
          sx={{
            textTransform:
              'none',
            fontSize:
              '0.78rem',
            fontWeight: 600,
          }}
        >
          Create New meeting
        </Button>
      </Box>
    </Box>
  )
}