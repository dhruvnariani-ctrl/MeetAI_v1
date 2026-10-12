import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import SlidingSegmented from '../SlidingSegmented'

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
  onCurrentPeriod,
  selectedDateLabel = 'Today',

  autoJoin = false,

  onAutoJoinChange,

  onNewMeeting,
}) {
  const [anchorEl, setAnchorEl] = useState(null)

  const menuOpen = Boolean(anchorEl)

  const getDateActions = () => {
    if (view === 'week') {
      return [
        {
          label: 'This week',
          action: onCurrentPeriod,
        },
        {
          label: 'Last week',
          action: onPrevious,
        },
        {
          label: 'Next week',
          action: onNext,
        },
      ]
    }

    if (view === 'month') {
      return [
        {
          label: 'This month',
          action: onCurrentPeriod,
        },
        {
          label: 'Last month',
          action: onPrevious,
        },
        {
          label: 'Next month',
          action: onNext,
        },
      ]
    }

    return [
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
  }

  const quickActions = getDateActions()

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
      {/* ============================================================ */}
      {/* DATE DROPDOWN                                                 */}
      {/* ============================================================ */}

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
            setAnchorEl(event.currentTarget)
          }
          sx={buttonSx}
        >
          {selectedDateLabel}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            'aria-label': 'Choose date',
          }}
        >
          {quickActions.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() =>
                handleQuickAction(item)
              }
              sx={{
                minWidth: 150,
                fontSize: '0.9rem',
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      {/* ============================================================ */}
      {/* CENTER CONTROLS                                               */}
      {/* ============================================================ */}

      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        justifyContent="center"
      >
        <IconButton
          size="small"
          data-tour="calendar-previous"
          onClick={onPrevious}
          aria-label={`Previous ${view}`}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          data-tour="calendar-next"
          onClick={onNext}
          aria-label={`Next ${view}`}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>

        <SlidingSegmented
          dataTour="calendar-view"
          value={view}
          onChange={onViewChange}
          options={VIEWS}
          ariaLabel="Calendar view"
          size="compact"
        />
      </Stack>

      {/* ============================================================ */}
      {/* INVITE MEETAI + NEW MEETING                                   */}
      {/* ============================================================ */}

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
            fontSize: '0.78rem',
            fontWeight: 600,
            p: '4px',
          }}
        >
          <InviteSwitch
            checked={autoJoin}
            onChange={onAutoJoinChange}
          />
        </Box>

        <Button
          data-tour="new-meeting"
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewMeeting}
          sx={{
            textTransform: 'none',
            fontSize: '0.78rem',
            fontWeight: 600,
          }}
        >
          Create New meeting
        </Button>
      </Box>
    </Box>
  )
}