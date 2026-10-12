import { Link as RouterLink, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils'
import { formatTime } from '../utils/time'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import SyncIcon from '@mui/icons-material/Sync'
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    to: '/',
    Icon: GridViewOutlinedIcon,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    to: '/calendar',
    Icon: CalendarTodayOutlinedIcon,
  },
  {
    id: 'recorded',
    label: 'Recorded Meetings',
    to: '/recorded',
    Icon: DescriptionOutlinedIcon,
  },
  {
    id: 'tasks',
    label: 'My Tasks',
    to: '/tasks',
    Icon: AssignmentTurnedInOutlinedIcon,
  },

  // Hidden for now.
  // {
  //   id: 'upcoming',
  //   label: 'Upcoming meetings',
  //   to: '/upcoming',
  //   Icon: PlayCircleOutlinedIcon,
  // },

  // {
  //   id: 'all',
  //   label: 'All Meetings',
  //   to: '/all',
  //   Icon: VideocamOutlinedIcon,
  // },
]

const EXPANDED_W = 256
const COLLAPSED_W = 72

const HEADER_H = 56

const bg =
  'linear-gradient(180deg, #e6f0fc 0%, #edf4fd 60%, #f4f8fe 100%)'

function SidebarAction({
  Icon,
  label,
  expanded,
  onClick,
  tooltip,
  component,
  to,
  ...rest
}) {
  const hide = expanded ? {} : visuallyHidden

  return (
    <Tooltip
      title={tooltip ?? (expanded ? '' : label)}
      placement="right"
      describeChild
    >
      <ButtonBase
        component={component}
        to={to}
        onClick={onClick}
        {...rest}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: expanded ? 'flex-start' : 'center',
          gap: '18px',

          width: expanded ? '100%' : 48,
          height: expanded ? 40 : 48,

          mx: 'auto',
          px: expanded ? '20px' : 0,

          borderRadius: expanded ? '10px' : '14px',

          fontSize: '0.9rem',
          fontWeight: 500,
          color: 'text.primary',

          '&:hover': {
            bgcolor: 'rgba(10,98,201,.08)',
          },
        }}
      >
        <Icon sx={{ fontSize: 20 }} />

        <Box component="span" sx={hide}>
          {label}
        </Box>
      </ButtonBase>
    </Tooltip>
  )
}

function SidebarContent({
  expanded,
  onInstantJoin,
  onItemClick,
  showCollapse,
  onToggle,
  lastSynced,
  onSync,
}) {
  const { pathname } = useLocation()

  const isActive = (to) =>
    to === '/'
      ? pathname === '/'
      : pathname === to || pathname.startsWith(`${to}/`)

  const hide = expanded ? {} : visuallyHidden

  const syncedText = lastSynced
    ? `Last updated ${formatTime(lastSynced)}`
    : 'Not synced yet'

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',

        width: '100%',
        height: '100%',
        minHeight: 0,

        overflow: 'hidden',

        p: '14px 12px 10px',
        boxSizing: 'border-box',
      }}
    >
      {/* =====================================================
          NAVIGATION AREA
          Only this section is allowed to scroll.
          ===================================================== */}
      <Box
        component="nav"
        aria-label="Primary"
        sx={{
          flex: 1,
          minHeight: 0,

          overflowY: 'auto',
          overflowX: 'hidden',

          pr: 0.25,

          scrollbarWidth: 'thin',

          '&::-webkit-scrollbar': {
            width: 6,
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(11,37,69,.22)',
            borderRadius: 999,
          },

          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        }}
      >
        {/* Add MeetAI */}
        <Tooltip
          title={expanded ? '' : 'Add MeetAI to a Meeting'}
          placement="right"
        >
          <Button
            data-tour="Add MeetAI to a Meeting"
            variant="contained"
            disableElevation
            onClick={onInstantJoin}
            sx={{
              display: 'flex',
              gap: 1.25,

              mx: 'auto',

              width: expanded ? '100%' : 48,
              minWidth: 0,

              height: expanded ? 44 : 48,

              p: 0,

              borderRadius: expanded ? '22px' : '50%',

              fontSize: '0.9375rem',
              fontWeight: 600,

              background:
                'linear-gradient(90deg, #0f9f78, #0a62c9)',

              '&:hover': {
                filter: 'brightness(1.08)',
              },
            }}
          >
            <BoltOutlinedIcon sx={{ fontSize: 22 }} />

            <Box component="span" sx={hide}>
              Add MeetAI to a Meeting
            </Box>
          </Button>
        </Tooltip>

        {/* Navigation items */}
        <List
          data-tour="sidebar-navigation"
          role="list"
          disablePadding
          sx={{
            mt: 1.5,
            display: 'grid',
            gap: '4px',
          }}
        >
          {NAV_ITEMS.map(({ id, label, to, Icon }) => {
            const selected = isActive(to)

            return (
              <ListItem key={id} disablePadding>
                <Tooltip
                  title={expanded ? '' : label}
                  placement="right"
                >
                  <ListItemButton
                    component={RouterLink}
                    to={to}
                    selected={selected}
                    aria-current={
                      selected ? 'page' : undefined
                    }
                    onClick={onItemClick}
                    sx={{
                      height: expanded ? 40 : 48,

                      width: expanded ? '100%' : 48,

                      mx: 'auto',

                      px: expanded ? '20px' : 0,

                      justifyContent: expanded
                        ? 'flex-start'
                        : 'center',

                      borderRadius: expanded
                        ? '10px'
                        : '14px',

                      color: 'text.primary',

                      '&.Mui-selected, &.Mui-selected:hover': {
                        bgcolor: '#d6e6fa',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,

                        mr: expanded
                          ? '18px'
                          : 0,

                        color: 'inherit',
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </ListItemIcon>

                    <ListItemText
                      primary={label}
                      sx={{
                        m: 0,

                        ...hide,

                        '& .MuiTypography-root': {
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                        },
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* =====================================================
          BOTTOM CONTROLS
          These never scroll out of the viewport.
          ===================================================== */}
      <Box
        data-tour="sidebar-controls"
        sx={{
          flexShrink: 0,

          display: 'grid',
          gap: '4px',

          pt: 1,

          borderTop:
            '1px solid rgba(11,37,69,.1)',
        }}
      >
        {/* Refresh */}
        <SidebarAction
          Icon={SyncIcon}
          label="Refresh"
          expanded={expanded}
          onClick={onSync}
          tooltip={
            <>
              <strong>Refresh</strong>
              <br />
              {syncedText}
            </>
          }
        />

        {/* How it works */}
        <SidebarAction
          Icon={HelpOutlinedIcon}
          label="How it works"
          expanded={expanded}
          component={RouterLink}
          to="/how-it-works"
          onClick={onItemClick}
        />

        {/* Collapse */}
        {showCollapse && (
          <SidebarAction
            Icon={
              expanded
                ? ChevronLeftIcon
                : ChevronRightIcon
            }
            label={
              expanded
                ? 'Collapse'
                : 'Expand sidebar'
            }
            expanded={expanded}
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls="sidebar"
          />
        )}
      </Box>
    </Box>
  )
}

export default function Sidebar({
  open,
  onToggle,
  onInstantJoin,
  lastSynced,
  onSync,
}) {
  const theme = useTheme()

  const isMobile = useMediaQuery(
    theme.breakpoints.down('md'),
    {
      noSsr: true,
    },
  )

  const shared = {
    onInstantJoin,
    lastSynced,
    onSync,
  }

  /* =====================================================
     MOBILE
     ===================================================== */
  if (isMobile) {
    return (
      <Drawer
        id="sidebar"
        data-tour="sidebar"
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: EXPANDED_W,

            height: '100vh',
            maxHeight: '100vh',

            boxSizing: 'border-box',

            background: bg,

            overflow: 'hidden',
          },
        }}
      >
        <SidebarContent
          expanded
          showCollapse={false}
          onItemClick={onToggle}
          onToggle={onToggle}
          {...shared}
        />
      </Drawer>
    )
  }

  /* =====================================================
     DESKTOP / TABLET
     ===================================================== */

  const w = open ? EXPANDED_W : COLLAPSED_W

  return (
    <Drawer
      id="sidebar"
      variant="permanent"
      data-tour="sidebar"
      sx={{
        width: w,

        // Sidebar starts below the 56px header.
        height: `calc(100vh - ${HEADER_H}px)`,

        flexShrink: 0,

        transition: theme.transitions.create(
          'width',
          {
            duration: 200,
          },
        ),

        '& .MuiDrawer-paper': {
          position: 'relative',

          width: w,

          // IMPORTANT:
          // The header already occupies 56px.
          height: `calc(100vh - ${HEADER_H}px)`,
          maxHeight: `calc(100vh - ${HEADER_H}px)`,

          boxSizing: 'border-box',

          flexShrink: 0,

          border: 0,

          background: bg,

          // Never allow the whole sidebar to scroll.
          overflow: 'hidden',

          transition: theme.transitions.create(
            'width',
            {
              duration: 200,
            },
          ),
        },
      }}
    >
      <SidebarContent
        expanded={open}
        showCollapse
        onToggle={onToggle}
        {...shared}
      />
    </Drawer>
  )
}